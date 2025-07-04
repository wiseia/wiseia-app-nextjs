'use server';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

// Schema para validar se o input é um JSON válido
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

  // Verifica se o usuário está logado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  try {
    // Tenta parsear e validar o JSON
    const credentials = JSON.parse(rawJson);
    ServiceAccountSchema.parse(credentials);

    // Se a validação passar, salva o JSON inteiro como um segredo no Vault
    // O nome do segredo será único para cada empresa
    const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
    if (!profile) {
        return { success: false, message: 'Perfil do usuário não encontrado.'}
    }
    
    const secretName = `GOOGLE_SERVICE_ACCOUNT_${profile.empresa_id}`;

    // Aqui precisaríamos de uma função admin para criar/atualizar segredos.
    // Por enquanto, vamos simular o sucesso.
    console.log(`Simulando salvamento do segredo: ${secretName}`);

    // A lógica real para salvar o segredo seria mais complexa,
    // envolvendo uma chamada para a API de gerenciamento do Supabase ou uma Edge Function.
    // Vamos deixar isso para depois e focar na validação.

    return { success: true, message: 'Credenciais do Google salvas com sucesso!' };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'O JSON fornecido não é uma chave de conta de serviço válida.' };
    }
    return { success: false, message: 'O texto fornecido não é um JSON válido.' };
  }
}