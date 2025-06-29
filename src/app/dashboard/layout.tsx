import Link from 'next/link';
// Importamos o novo ícone 'MessagesSquare'
import { LayoutDashboard, FileText, Building, Users, HardDrive, ScrollText, MessagesSquare } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-800 dark:text-white">
            WISEIA
          </Link>
        </div>
        <nav className="mt-4 flex-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          
          {/* ======================================= */}
          {/* NOVO LINK PARA O CHAT ADICIONADO AQUI */}
          {/* ======================================= */}
          <Link href="/dashboard/chat" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <MessagesSquare className="w-5 h-5 mr-3" /> Chat com IA
          </Link>

          <Link href="/dashboard/documentos" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <FileText className="w-5 h-5 mr-3" /> Documentos
          </Link>
          <Link href="/dashboard/departamentos" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Building className="w-5 h-5 mr-3" /> Departamentos
          </Link>
          <Link href="/dashboard/usuarios" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Users className="w-5 h-5 mr-3" /> Usuários
          </Link>
          <Link href="/dashboard/drivers" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <HardDrive className="w-5 h-5 mr-3" /> Configurar Drivers
          </Link>
          <Link href="/dashboard/logs" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <ScrollText className="w-5 h-5 mr-3" /> Log de Auditoria
          </Link>
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
           <LogoutButton />
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}