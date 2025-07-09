'use client'; 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { saveGoogleServiceAccount } from './actions';

export default function DriversPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    if (!jsonInput.trim()) {
      toast.error("O campo de credenciais não pode estar vazio.");
      setIsSaving(false);
      return;
    }

    const result = await saveGoogleServiceAccount(jsonInput);

    if (result && result.success) {
      toast.success(result.message);
      setJsonInput(''); 
    } else {
      toast.error(result?.message || "Ocorreu uma falha no servidor.");
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