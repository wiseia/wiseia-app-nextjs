import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAI } from 'https://esm.sh/openai@4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();
    if (!documentId) {
      throw new Error('ID do documento não fornecido na requisição.');
    }
    console.log(`Iniciando processamento para o documento: ${documentId}`);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    });

    const { data: document, error: docError } = await supabaseAdmin
      .from('documentos_indexados')
      .select('caminho_arquivo_drive')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Erro ao buscar documento:', docError);
      throw new Error(`Documento com ID ${documentId} não encontrado.`);
    }
    console.log('Documento encontrado. Link:', document.caminho_arquivo_drive);

    const fileContent = "Este é um contrato de locação. O locatário concorda em pagar o aluguel no dia 5 de cada mês. A multa por atraso é de 10% sobre o valor do aluguel. O contrato tem vigência de 30 meses, iniciando em 1 de Junho de 2024. A rescisão antecipada implica em multa de 3 aluguéis.";
    console.log('Conteúdo do arquivo (simulado):', fileContent);

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: fileContent,
    });
    const embedding = embeddingResponse.data[0].embedding;
    console.log('Embedding gerado com sucesso.');

    console.log('Salvando embedding e conteúdo no banco de dados...');
    const { error: updateError } = await supabaseAdmin
      .from('documentos_indexados')
      .update({ 
        embedding: embedding,
        content: fileContent,
        ultimo_processamento: new Date().toISOString() 
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Erro ao salvar embedding:', updateError);
      throw updateError;
    }
    console.log('Embedding salvo com sucesso!');

    return new Response(
      JSON.stringify({ message: `Documento ${documentId} processado e indexado!` }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado durante o processamento.";
    console.error('Erro geral na função process-document:', error);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); // <-- A CHAVE E O PARÊNTESE FINAIS FORAM ADICIONADOS AQUI