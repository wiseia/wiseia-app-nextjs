import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Esta função cria uma nova resposta que podemos modificar
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Cria um cliente Supabase que pode operar no middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          // Se o middleware precisar definir um cookie, ele o adiciona à requisição e à resposta
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          // O mesmo para remover
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ATUALIZAÇÃO IMPORTANTE: Pegamos o usuário ANTES de retornar a resposta
  await supabase.auth.getUser()

  // Retorna a resposta (possivelmente com os cookies de sessão atualizados)
  return response
}

// Configuração para rodar o middleware em todas as rotas relevantes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}