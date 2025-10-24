'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Spinner } from '@/components/ui/Spinner';
import { useChatStore } from '@/lib/store';

export default function ChatPage() {
  const router = useRouter();
  const { selectedModel } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check auth
  const { data: session, isLoading: sessionLoading } = trpc.auth.getSession.useQuery();
  
  // Get chat history
  const { data: messages, refetch } = trpc.chat.history.useQuery(
    { modelTag: selectedModel || undefined },
    { enabled: !!session }
  );

  // Send message mutation
  const sendMutation = trpc.chat.send.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/auth/login');
    } else if (session && !isInitialized) {
      setIsInitialized(true);
    }
  }, [session, sessionLoading, router, isInitialized]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    sendMutation.mutate({
      modelTag: selectedModel,
      prompt: message,
    });
  };

  if (sessionLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {!selectedModel && (
            <div className="text-center text-muted-foreground py-8">
              Please select an AI model to start chatting
            </div>
          )}

          {messages?.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}

          {sendMutation.isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Spinner size="sm" />
                <p className="text-sm text-muted-foreground mt-2">AI is thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={sendMutation.isLoading}
            disabled={!selectedModel}
          />
        </div>
      </main>
    </div>
  );
}