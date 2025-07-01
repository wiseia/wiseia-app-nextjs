import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Bem-vindo ao WISEIA</h1>
      <p className="mt-4 text-lg text-muted-foreground">Sua plataforma de análise inteligente de documentos.</p>
      <Button asChild className="mt-8">
        <Link href="/login">Acessar Plataforma</Link>
      </Button>
    </div>
  );
}