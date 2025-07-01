'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login') // Redireciona para a página de login
  }

  return (
    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
      <LogOut className="w-4 h-4 mr-2" />
      Sair
    </Button>
  )
}