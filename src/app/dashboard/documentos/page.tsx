import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from './data-table';
import RegisterDocumentForm from '@/components/documents/RegisterDocumentForm';

export default async function DocumentosPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/');

  const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
  if (!profile) return <div>Perfil não encontrado.</div>;

  const empresaId = profile.empresa_id;

  // Busca tanto os documentos QUANTO os departamentos
  const { data: documentos } = await supabase
    .from('documentos_indexados')
    .select(`*, departamento:departamentos ( nome )`)
    .eq('empresa_id', empresaId);
    
  const { data: departamentos } = await supabase
    .from('departamentos')
    .select('*')
    .eq('empresa_id', empresaId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Documentos</h1>
        {/* Passamos a lista de departamentos para o formulário */}
        <RegisterDocumentForm departamentos={departamentos || []} />
      </div>
      <DataTable columns={columns} data={documentos || []} />
    </div>
  );
}