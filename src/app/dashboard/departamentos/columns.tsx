'use client'

import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

// Importa os componentes de ação
import EditDepartmentForm from "@/components/departments/EditDepartmentForm"
import DeleteDepartmentDialog from "@/components/departments/DeleteDepartmentDialog"

export type Departamento = {
  id: string
  nome: string
  descricao: string | null
  created_at: string
}

export const columns: ColumnDef<Departamento>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => {
        const descricao = row.getValue("descricao") as string | null;
        return <div className="truncate max-w-[400px]">{descricao || 'N/A'}</div>
    }
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <span>{date.toLocaleDateString('pt-BR')}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const departamento = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            
            <EditDepartmentForm department={departamento} />

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(departamento.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Componente de exclusão é renderizado aqui */}
            <DeleteDepartmentDialog 
              departmentId={departamento.id} 
              departmentName={departamento.nome} 
            />

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]