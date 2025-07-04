'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GoogleSignInButton() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ESTA É A LINHA ADICIONADA.
        // Ela diz ao Supabase para onde o Google deve redirecionar o usuário
        // após a autorização, para que nossa rota de callback possa finalizar o processo.
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Erro ao iniciar login com Google:", error);
      toast.error("Não foi possível iniciar o login com o Google.");
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
      Continuar com Google
    </Button>
  );
}