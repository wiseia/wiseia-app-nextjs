'use server'; // Marca este arquivo para rodar apenas no servidor

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define a "forma" que os dados do formulário devem ter para criar e editar
const FormSchema = z.object({
  id: z.string().optional(), // ID é opcional (só existe na edição)
  nome: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
  descricao: z.string().optional(),
});

// ===============================================
// FUNÇÃO DE CRIAR (Seu código original, mantido)
// ===============================================
export async function createDepartment(formData: FormData) {
  const supabase = createClient();

  // Valida os dados do formulário usando o schema do Zod
  const validatedFields = FormSchema.safeParse({
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
  });

  // Se a validação falhar, retorna um erro
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao criar departamento.',
    };
  }

  const { nome, descricao } = validatedFields.data;

  // Pega a empresa do usuário logado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Usuário não autenticado.' };
  }
  const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
  if (!profile) {
    return { message: 'Perfil do usuário não encontrado.' };
  }

  // Insere o novo departamento no banco de dados
  const { error } = await supabase
    .from('departamentos')
    .insert([{ nome, descricao, empresa_id: profile.empresa_id }]);

  if (error) {
    console.error('Erro no Supabase:', error);
    return { message: 'Erro no banco de dados: Falha ao criar departamento.' };
  }

  // Limpa o cache da página de departamentos para que a nova lista seja exibida
  revalidatePath('/dashboard/departamentos');

  return { message: 'Departamento criado com sucesso!' };
}


// ===============================================
// NOVA FUNÇÃO DE ATUALIZAR (UPDATE)
// ===============================================
export async function updateDepartment(formData: FormData) {
  const supabase = createClient();
  const validatedFields = FormSchema.safeParse({
    id: formData.get('id'),
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
  });

  if (!validatedFields.success) {
    return { message: 'Campos inválidos. Falha ao atualizar.' };
  }
  
  const { id, nome, descricao } = validatedFields.data;
  if (!id) {
      return { message: 'ID do departamento não fornecido.'}
  }

  const { error } = await supabase
    .from('departamentos')
    .update({ nome, descricao })
    .eq('id', id);

  if (error) {
    console.error('Erro no Supabase ao atualizar:', error);
    return { message: 'Erro no banco de dados: Falha ao atualizar.' };
  }

  revalidatePath('/dashboard/departamentos');
  return { message: 'Departamento atualizado com sucesso!' };
}


// ===============================================
// NOVA FUNÇÃO DE EXCLUIR (DELETE)
// ===============================================
export async function deleteDepartment(departmentId: string) {
  // Validação simples para garantir que o ID não está vazio
  if (!departmentId) {
    return { message: 'ID do departamento inválido.' };
  }

  const supabase = createClient();
  
  const { error } = await supabase
    .from('departamentos')
    .delete()
    .eq('id', departmentId);

  if (error) {
    console.error('Erro no Supabase ao excluir:', error);
    return { message: 'Erro no banco de dados: Falha ao excluir.' };
  }

  revalidatePath('/dashboard/departamentos');
  return { message: 'Departamento excluído com sucesso!' };
}