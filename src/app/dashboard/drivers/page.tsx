// Este será um componente cliente para interatividade
'use client'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function DriversPage() {

  const handleSaveGoogleCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // A lógica para salvar as credenciais no Supabase Vault virá aqui
    // Por enquanto, vamos apenas mostrar uma mensagem de sucesso.
    toast.success("Credenciais salvas com sucesso! (Funcionalidade em desenvolvimento)");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Conectar Fontes de Documentos</h1>
      
      <form onSubmit={handleSaveGoogleCredentials} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Google Drive</h2>
        <p className="text-muted-foreground pb-4">
          Para conectar, siga nosso tutorial para criar uma <strong>Conta de Serviço</strong> no Google Cloud, 
          gere um arquivo de chave JSON e cole o conteúdo aqui.
        </p>
        
        <div className='space-y-1'>
          <Label htmlFor="google-credentials">Conteúdo do Arquivo de Chave JSON</Label>
          <textarea
            id="google-credentials"
            placeholder='Cole o conteúdo do seu arquivo JSON aqui... Ex: { "type": "service_account", ... }'
            className="w-full h-40 p-2 border rounded-md"
          />
        </div>

        <Button type="submit">
          Salvar Credenciais do Google
        </Button>
      </form>
    </div>
  );
}