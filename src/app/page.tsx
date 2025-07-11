'use client';

// Importamos o 'useState' junto com 'useEffect'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  // Novo state para controlar a renderização no cliente
  const [isClient, setIsClient] = useState(false);

  // Listener de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard');
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [router, supabase]);
  
  // Efeito para marcar que estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Se ainda não estivermos no cliente, não renderiza nada para evitar o erro.
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Acessar WISEIA</h1>
          <p className="text-muted-foreground">Entre com seu e-mail ou use o Google.</p>
        </div>
        
        <LoginForm />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
              OU
            </span>
          </div>
        </div>

        <GoogleSignInButton />
      </div>
    </div>
  );
}