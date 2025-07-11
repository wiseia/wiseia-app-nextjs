'use server';
import { createClient } from '@/utils/supabase/server';

export async function saveGoogleServiceAccount(rawJson: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Usuário não autenticado.' };
  
  try {
    JSON.parse(rawJson); // Apenas para validar o JSON
    const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
    if (!profile) return { success: false, message: 'Perfil não encontrado.' };
    
    const secretName = `GOOGLE_SERVICE_ACCOUNT_${profile.empresa_id}`;
    
    const { data, error: functionError } = await supabase.functions.invoke('save-secret', {
      body: { secretName: secretName, secretValue: rawJson }
    });

    if (functionError) throw functionError;

    return { success: true, message: data.message };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao salvar o segredo.';
    return { success: false, message };
  }
}