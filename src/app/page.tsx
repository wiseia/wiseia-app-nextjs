'use client';

// ================== CORREÇÃO DOS ERROS AQUI ==================
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client'; // <-- Resolve o Erro 1: "Cannot find name 'createClient'"
import LoginForm from '@/components/auth/LoginForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'; // <-- Resolve o Erro 2: "Parameter 'event' implicitly has an 'any' type"

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Corrigimos o tipo dos parâmetros do listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Verificação para garantir que o código só renderize no navegador
  if (typeof window === 'undefined') {
    return null; // Não renderiza nada durante a pré-renderização no servidor
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acessar WISEIA</h1>
          <p className="text-muted-foreground">Entre com seu e-mail ou use o Google.</p>
        </div>
        
        <LoginForm />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              OU
            </span>
          </div>
        </div>

        <GoogleSignInButton />
      </div>
    </div>
  );
}