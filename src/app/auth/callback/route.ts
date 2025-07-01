import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookies = request.cookies.clone()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => cookies.get(name)?.value,
          set: (name, value, options) => cookies.set({ name, value, ...options }),
          remove: (name, options) => cookies.delete({ name, ...options }),
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Cria uma resposta de redirecionamento e copia os cookies da requisição para a resposta
      const response = NextResponse.redirect(`${origin}${next}`)
      await supabase.auth.getSession() // Garante que a sessão esteja no cookie
      return response
    }
  }

  console.error('ERRO NO CALLBACK: Código não encontrado ou falha na troca.')
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}