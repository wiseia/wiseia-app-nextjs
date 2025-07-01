import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // A verificação fica um pouco mais limpa assim:
  // Se não houver um objeto 'user', redireciona.
  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard do WISEIA</h1>
      <p className="mt-4">Bem-vindo de volta!</p>
      {/* Usamos 'user.email' diretamente, pois já sabemos que ele existe */}
      <p>Você está logado como: <strong>{user.email}</strong></p>
    </div>
  );
}