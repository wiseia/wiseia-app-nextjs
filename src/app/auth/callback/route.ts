import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // O middleware já cuidou da sessão.
  // Apenas redirecionamos para o dashboard.
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/dashboard`)
}