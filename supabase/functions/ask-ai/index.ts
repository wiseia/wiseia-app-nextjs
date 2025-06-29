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
    const { query } = await req.json();
    if (!query) throw new Error("Pergunta (query) não fornecida.");

    // --- CORREÇÃO AQUI ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
    });
    // --- FIM DA CORREÇÃO ---

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    const { data: documents, error: matchError } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (matchError) throw matchError;

    // AVISO "no-explicit-any": Podemos ignorar por enquanto ou corrigir
    const contextText = documents
      .map((doc: { content: string }) => doc.content) // Corrigido para ser mais específico que 'any'
      .join("\n\n---\n\n");
    
    if (!documents || documents.length === 0 || !contextText.trim()) {
        return new Response(JSON.stringify({ answer: "Não encontrei informações sobre isso nos documentos." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    const prompt = `Você é um assistente especialista chamado WISEIA. Sua tarefa é responder à pergunta do usuário baseado estritamente no contexto fornecido abaixo. Seja direto e conciso.

    --- CONTEXTO ---
    ${contextText}
    --- FIM DO CONTEXTO ---

    PERGUNTA DO USUÁRIO:
    ${query}`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = chatResponse.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    console.error('Erro geral na função de chat:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});