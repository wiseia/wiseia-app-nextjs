const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { secretName, secretValue } = await req.json();
    if (!secretName || !secretValue) {
      throw new Error("Nome ou valor do segredo não foi fornecido no corpo da requisição.");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("As variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão configuradas na sua função.");
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/secrets`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
        'Content-Profile': 'vault'
      },
      body: JSON.stringify({ name: secretName, secret: secretValue }),
    });
    
    if (!response.ok) {
      // Se a resposta da API não for de sucesso, jogue o texto do erro
      const errorText = await response.text();
      throw new Error(`Erro da API do Supabase [${response.status}]: ${errorText}`);
    }
    
    const responseData = await response.json();

    return new Response(JSON.stringify({ success: true, message: "Segredo salvo com sucesso!", data: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Captura QUALQUER erro e o retorna na resposta da API
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    console.error("ERRO DETALHADO NA FUNÇÃO save-secret:", error);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
