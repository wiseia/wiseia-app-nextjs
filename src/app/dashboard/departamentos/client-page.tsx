'use client'; // <-- Marca este como um componente de cliente

import AddDepartmentForm from '@/components/departments/AddDepartmentForm';
import { columns, Departamento } from './columns';
import { DataTable } from './data-table';

// Este componente não busca dados, ele apenas os recebe e exibe.
export default function DepartmentClientPage({ departamentos }: { departamentos: Departamento[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departamentos</h1>
        <AddDepartmentForm />
      </div>
      <DataTable columns={columns} data={departamentos} />
    </div>
  );
}