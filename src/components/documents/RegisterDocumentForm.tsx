'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerDocument } from '@/app/dashboard/documentos/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Departamento } from '@/app/dashboard/departamentos/columns'; // Reutiliza o tipo que já criamos

const FormSchema = z.object({
  nome_arquivo: z.string().min(3, { message: "O nome é obrigatório." }),
  caminho_arquivo_drive: z.string().url({ message: "Por favor, insira uma URL válida." }),
  departamento_id: z.string({ required_error: "Selecione um departamento." }),
});

// O componente precisa receber a lista de departamentos para popular o dropdown
export default function RegisterDocumentForm({ departamentos }: { departamentos: Departamento[] }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append('nome_arquivo', data.nome_arquivo);
    formData.append('caminho_arquivo_drive', data.caminho_arquivo_drive);
    formData.append('departamento_id', data.departamento_id);

    const result = await registerDocument(formData);

    if (result?.message.includes('sucesso')) {
      toast.success(result.message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(result?.message || 'Ocorreu um erro.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Registrar Documento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Novo Documento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome_arquivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Arquivo (com extensão, ex: Contrato.pdf)</FormLabel>
                  <FormControl>
                    <Input placeholder="Proposta Comercial XPTO.docx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caminho_arquivo_drive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Google Drive / OneDrive</FormLabel>
                  <FormControl>
                    <Input placeholder="https://docs.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departamento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departamentos.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id}>
                          {depto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}