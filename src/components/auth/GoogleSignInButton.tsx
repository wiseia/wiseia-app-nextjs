'use client';

import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function GoogleSignInButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Não precisamos mais do redirectTo, pois não há redirecionamento de página inteira
      },
    });

    if (error) {
      console.error("Erro ao iniciar login com Google:", error);
      toast.error("Não foi possível iniciar o login com o Google.");
    }
    // O Supabase irá lidar com o pop-up e a atualização da sessão automaticamente.
    // O onAuthStateChange na página de login cuidará do redirecionamento.
  };

  return (
    <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
      Continuar com Google
    </Button>
  );
}