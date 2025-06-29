'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateDepartment } from '@/app/dashboard/departamentos/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// ========= A CORREÇÃO ESTÁ AQUI =========
const FormSchema = z.object({
  id: z.string(),
  nome: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
  // Agora aceitamos string, null, ou undefined
  descricao: z.string().nullable().optional(), 
});

// O tipo Departamento agora é importado de 'columns' para garantir consistência
import type { Departamento } from '@/app/dashboard/departamentos/columns';

export default function EditDepartmentForm({ department }: { department: Departamento }) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: department.id,
      nome: department.nome,
      // O valor inicial lida com 'null' sem problemas
      descricao: department.descricao || '', 
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('nome', data.nome);
    // Só adicionamos a descrição se ela não for nula ou vazia
    if (data.descricao) {
      formData.append('descricao', data.descricao);
    }

    const result = await updateDepartment(formData);

    if (result?.message.includes('sucesso')) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result?.message || 'Ocorreu um erro desconhecido.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Editar Departamento
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Departamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('id')} />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Financeiro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    {/* O valor do campo pode ser nulo, então precisamos garantir que seja uma string */}
                    <Input placeholder="Ex: Responsável por contas a pagar" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}