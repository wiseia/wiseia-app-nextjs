'use server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const ServiceAccountSchema = z.object({ /* ... schema do Zod ... */ });

export async function saveGoogleServiceAccount(rawJson: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Usuário não autenticado.' };

  try {
    const credentials = JSON.parse(rawJson);
    ServiceAccountSchema.parse(credentials);
    const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
    if (!profile) return { success: false, message: 'Perfil não encontrado.'};
    
    const secretName = `GOOGLE_SERVICE_ACCOUNT_${profile.empresa_id}`;

    const { error: functionError } = await supabase.functions.invoke('save-secret', {
      body: { secretName: secretName, secretValue: rawJson }
    });
    if (functionError) throw functionError;

    return { success: true, message: 'Credenciais do Google salvas com sucesso!' };
  } catch (error) {
    // ... tratamento de erro ...
  }
}