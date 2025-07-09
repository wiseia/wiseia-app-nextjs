const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Tenta ler o corpo da requisição
    const body = await req.json();

    // Pega as variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    // Monta um objeto de resposta com tudo que a função consegue ver
    const diagnostics = {
      message: "Dados de diagnóstico da função 'save-secret'",
      receivedBody: body,
      env: {
        SUPABASE_URL_EXISTS: !!supabaseUrl,
        SERVICE_ROLE_KEY_EXISTS: !!serviceRoleKey,
        OPENAI_API_KEY_EXISTS: !!openAiKey,
        SERVICE_ROLE_KEY_FIRST_CHARS: serviceRoleKey?.substring(0, 5) || null,
      }
    };

    // Retorna SEMPRE um status 200 com os dados de diagnóstico
    return new Response(JSON.stringify(diagnostics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Se até mesmo o req.json() falhar, ele cairá aqui
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
    return new Response(JSON.stringify({ error: `Falha ao processar a requisição: ${errorMessage}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
