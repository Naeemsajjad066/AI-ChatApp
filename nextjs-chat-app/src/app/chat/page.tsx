'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/lib/store';

export default function ChatPage() {
  const router = useRouter();
  const { selectedModel, isSidebarOpen, toggleSidebar, setSidebarOpen } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set sidebar closed on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

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
      <Loader
        variant="spinner"
        size="lg"
        text="Loading chat..."
        fullscreen
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ChatSidebar />
      
      <main className="flex-1 flex flex-col w-full">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden border-b bg-card p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {selectedModel || 'Select a Model'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
                <Loader variant="bars" size="sm" />
                <p className="text-sm text-muted-foreground">AI is thinking...</p>
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