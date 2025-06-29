'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Send } from 'lucide-react';

// Define a "forma" de uma mensagem no chat
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Chama nossa Edge Function 'ask-ai'
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: { query: input },
      });

      if (error) throw new Error(error.message);

      const assistantMessage: Message = { role: 'assistant', content: data.answer };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao contatar a IA.";
      const errorResponseMessage: Message = { role: 'assistant', content: errorMessage };
      setMessages((prev) => [...prev, errorResponseMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Ocupa a altura da tela menos o header */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <h1 className="text-2xl font-bold">Chat com Documentos</h1>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                {msg.content}
              </div>
            </div>
          ))}
           {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="animate-pulse">...</div>
                </div>
              </div>
            )}
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Faça uma pergunta sobre seus documentos..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}