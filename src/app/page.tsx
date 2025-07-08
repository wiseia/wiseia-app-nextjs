'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ... outras importações

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return ( /* ... o JSX da sua página de login com o GoogleSignInButton ... */ );
}