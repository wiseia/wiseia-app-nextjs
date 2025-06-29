import { createClient } from '@/utils/supabase/server'; // <--- COM chaves
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient(); // <--- COM um único ()

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard do WISEIA</h1>
      <p className="mt-4">Bem-vindo de volta!</p>
      <p>Você está logado como: <strong>{data.user.email}</strong></p>
    </div>
  );
}