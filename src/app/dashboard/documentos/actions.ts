'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema de validação para o formulário de registro de documento
const DocumentSchema = z.object({
  nome_arquivo: z.string().min(3, { message: 'O nome do arquivo é obrigatório.' }),
  caminho_arquivo_drive: z.string().url({ message: 'Por favor, insira uma URL válida.' }),
  departamento_id: z.string().uuid({ message: 'Por favor, selecione um departamento.' }),
  // O tipo de arquivo será extraído do nome, mas pode ser opcional aqui
  tipo_arquivo: z.string().optional(), 
});

export async function registerDocument(formData: FormData) {
  const supabase = createClient();

  const validatedFields = DocumentSchema.safeParse({
    nome_arquivo: formData.get('nome_arquivo'),
    caminho_arquivo_drive: formData.get('caminho_arquivo_drive'),
    departamento_id: formData.get('departamento_id'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Falha ao registrar o documento.',
    };
  }

  const { nome_arquivo, caminho_arquivo_drive, departamento_id } = validatedFields.data;
  
  // Extrai a extensão do arquivo para salvar o tipo
  const tipo_arquivo = nome_arquivo.split('.').pop()?.toLowerCase() || 'desconhecido';

  // Pega o usuário e a empresa
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: 'Usuário não autenticado.' };
  
  const { data: profile } = await supabase.from('usuarios').select('empresa_id').eq('id', user.id).single();
  if (!profile) return { message: 'Perfil do usuário não encontrado.' };

  // Insere os metadados do documento no banco de dados
  const { error } = await supabase
    .from('documentos_indexados')
    .insert([{ 
      nome_arquivo, 
      caminho_arquivo_drive, 
      departamento_id, 
      empresa_id: profile.empresa_id,
      tipo_arquivo
    }]);

  if (error) {
    console.error('Erro ao registrar documento:', error);
    return { message: 'Erro no banco de dados: Falha ao registrar documento.' };
  }

  revalidatePath('/dashboard/documentos');
  return { message: 'Documento registrado com sucesso!' };
}