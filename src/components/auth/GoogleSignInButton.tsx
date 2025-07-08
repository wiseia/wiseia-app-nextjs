'use client';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GoogleSignInButton() {
  const supabase = createClient();
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) toast.error("Não foi possível iniciar o login com o Google.");
  };
  return <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">Continuar com Google</Button>;
}