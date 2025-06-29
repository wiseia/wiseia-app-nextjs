// Usaremos a estrutura de arquivos do projeto novo, sem a pasta _components
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { columns, Departamento } from './columns';
import { DataTable } from './data-table';
import AddDepartmentForm from '@/components/departments/AddDepartmentForm';

export default async function DepartamentosPage() {
  const supabase = createClient();

  // Passo 1: Garantir que há um usuário logado.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/');
  }

  // Passo 2: Buscar os departamentos DIRETAMENTE.
  // Vamos confiar na RLS da tabela 'departamentos' para fazer a mágica.
  const { data: departamentos, error } = await supabase
    .from('departamentos')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro na busca direta de departamentos:", error.message);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Departamentos</h1>
        <AddDepartmentForm />
      </div>
      {/* Se 'departamentos' for nulo ou vazio, a tabela mostrará "Nenhum resultado" */}
      <DataTable columns={columns} data={departamentos || []} />
    </div>
  );
}