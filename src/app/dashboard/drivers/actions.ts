'use server';

import { google } from 'googleapis';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function getGoogleAuthUrl() {
  // Usamos o cliente normal, não precisamos mais do admin
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Usuário não autenticado.');
  }
  
  // ================= A CORREÇÃO ESTÁ AQUI =================
  // Chamamos nossa nova função 'get_secret' para cada credencial
  const { data: googleClientId, error: clientIdError } = await supabase.rpc('get_secret', { secret_name: 'GOOGLE_CLIENT_ID' });
  const { data: googleClientSecret, error: clientSecretError } = await supabase.rpc('get_secret', { secret_name: 'GOOGLE_CLIENT_SECRET' });
  // ========================================================
  
  if (clientIdError || clientSecretError || !googleClientId || !googleClientSecret) {
    console.error("Erro ao buscar segredos:", clientIdError, clientSecretError);
    throw new Error("Não foi possível carregar as credenciais do Google do Vault.");
  }

  const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback` 
  );

  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: JSON.stringify({ user_id: user.id }),
  });
  
  return redirect(url);
}