'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <-- Importante

export default function IndexButton({ documentId }: { documentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter(); // <-- Importante

  const handleIndex = async () => {
    setIsLoading(true);
    toast.info('Iniciando indexação do documento...');

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: { documentId },
    });

    if (error) {
      console.error('Erro ao invocar a função:', error);
      toast.error(`Falha na indexação: ${error.message}`);
    } else {
      console.log('Sucesso:', data);
      toast.success(data.message || 'Documento indexado com sucesso!');
      
      // A linha que resolve o problema de atualização
      router.refresh(); 
    }
    
    setIsLoading(false);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleIndex}
      disabled={isLoading}
    >
      <BrainCircuit className="w-4 h-4 mr-2" />
      {isLoading ? 'Indexando...' : 'Indexar com IA'}
    </Button>
  );
}