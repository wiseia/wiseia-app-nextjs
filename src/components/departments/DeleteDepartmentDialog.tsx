'use client';

import { useState } from 'react';
import { deleteDepartment } from '@/app/dashboard/departamentos/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function DeleteDepartmentDialog({ departmentId, departmentName }: { departmentId: string, departmentName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const result = await deleteDepartment(departmentId);

    if (result?.message.includes('sucesso')) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result?.message || 'Ocorreu um erro.');
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:bg-red-100 focus:text-red-800"
        >
          Excluir Departamento
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente o departamento 
            <strong>“{departmentName}”</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
