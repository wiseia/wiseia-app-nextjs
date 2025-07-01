// src/app/auth/callback/route.ts

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Após a troca, redireciona para o dashboard. O middleware cuidará da sessão.
  return NextResponse.redirect(new URL('/dashboard', request.url))
}