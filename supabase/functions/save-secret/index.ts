import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { secretName, secretValue } = await req.json();
    if (!secretName || !secretValue) {
      throw new Error("Nome ou valor do segredo não fornecido.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { error: upsertError } = await supabaseAdmin.from('vault.secrets')
      .upsert({ name: secretName, secret: secretValue }, { onConflict: 'name' });
    
    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ success: true, message: "Segredo salvo com sucesso." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // A CORREÇÃO ESTÁ AQUI
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    console.error("Erro na função save-secret:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
