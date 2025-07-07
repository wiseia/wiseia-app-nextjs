'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// O schema para validar o JSON da conta de serviço continua o mesmo
const ServiceAccountSchema = z.object({
  type: z.literal('service_account'),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string(),
  client_email: z.string().email(),
  client_id: z.string(),
});

export async function saveGoogleServiceAccount(rawJson: string) {
  const supabase = createClient();

  // 1. Verifica se o usuário está logado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  try {
    // 2. Tenta validar o JSON que o usuário colou
    const credentials = JSON.parse(rawJson);
    ServiceAccountSchema.parse(credentials);

    // 3. Pega o ID da empresa do usuário para criar um nome de segredo único
    const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
    if (!profile) {
        return { success: false, message: 'Perfil do usuário não encontrado.'}
    }
    
    const secretName = `GOOGLE_SERVICE_ACCOUNT_${profile.empresa_id}`;

    // ================== A LÓGICA REAL ESTÁ AQUI ==================
    // 4. Chama a nossa nova Edge Function para salvar o segredo de forma segura
    const { error: functionError } = await supabase.functions.invoke('save-secret', {
      body: {
        secretName: secretName,
        secretValue: rawJson // Passamos o JSON inteiro como uma string
      }
    });

    if (functionError) {
      // Se a Edge Function retornar um erro, nós o repassamos
      throw functionError;
    }
    // =============================================================

    return { success: true, message: 'Credenciais do Google salvas com sucesso!' };

  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'O JSON fornecido não é uma chave de conta de serviço válida.' };
    }
    if (error instanceof SyntaxError) {
      return { success: false, message: 'O texto fornecido não é um JSON válido.' };
    }
    // Tratamento para erros da Edge Function
    const message = error instanceof Error ? error.message : 'Falha ao salvar o segredo.';
    return { success: false, message };
  }
}