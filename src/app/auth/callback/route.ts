import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // Apenas tenta trocar o código. O middleware fará o resto.
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redireciona de volta para a página de onde o processo começou.
  return NextResponse.redirect(`${origin}/dashboard/drivers`)
}