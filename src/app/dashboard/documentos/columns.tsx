'use client'

import { ColumnDef } from "@tanstack/react-table"
import { FileText, Link as LinkIcon, MoreHorizontal } from "lucide-react"
import IndexButton from "@/components/documents/actions/IndexButton"; // <-- IMPORTA O NOVO BOTÃO
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type DocumentoIndexado = {
  id: string
  nome_arquivo: string
  tipo_arquivo: string | null
  caminho_arquivo_drive: string
  departamento: { nome: string } | null
  ultimo_processamento: string | null
}

export const columns: ColumnDef<DocumentoIndexado>[] = [
  // ... (as outras colunas 'nome_arquivo', 'departamento', etc. continuam aqui)
  // Nenhuma mudança nelas.
  {
    accessorKey: "nome_arquivo",
    header: "Nome do Arquivo",
    // ...
  },
  {
    accessorKey: "departamento.nome",
    header: "Departamento",
  },
  {
    accessorKey: "caminho_arquivo_drive",
    header: "Link",
    // ...
  },
  {
    accessorKey: "ultimo_processamento",
    header: "Última Análise",
    // ...
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const documento = row.original

      return (
        <div className="flex items-center justify-end gap-2">
          {/* Mostra o botão de indexar apenas se o documento ainda não foi processado */}
          {!documento.ultimo_processamento && (
            <IndexButton documentId={documento.id} />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Editar Metadados</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Excluir Registro</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]