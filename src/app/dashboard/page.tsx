'use client'; 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
// A importação da server action foi removida

export default function DriversPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    // A lógica de salvar será implementada no futuro.
    // Por enquanto, apenas simulamos.
    if (!jsonInput.trim()) {
      toast.error("O campo de credenciais não pode estar vazio.");
    } else {
      toast.info("Funcionalidade de salvar credenciais em desenvolvimento.");
    }

    setIsSaving(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Conectar Fontes de Documentos</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Google Drive</h2>
        <p className="text-muted-foreground pb-4">
          Para conectar, siga nosso tutorial para criar uma <strong>Conta de Serviço</strong> no Google Cloud, 
          gere um arquivo de chave JSON e cole o conteúdo completo aqui.
        </p>
        
        <div className='space-y-1'>
          <Label htmlFor="google-credentials">Conteúdo do Arquivo de Chave JSON</Label>
          <textarea
            id="google-credentials"
            placeholder='Cole o conteúdo do seu arquivo JSON aqui...'
            className="w-full h-40 p-2 border rounded-md font-mono text-sm"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Credenciais do Google'}
        </Button>
      </form>
    </div>
  );
}