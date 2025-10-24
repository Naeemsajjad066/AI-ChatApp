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
  const [localMessages, setLocalMessages] = useState<any[]>([]);

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
    onSuccess: (data) => {
      // Smoothly add AI response without touching user message
      if (data?.assistantMessage) {
        setLocalMessages(prev => {
          // Find and update the temp user message with real ID (no re-render flicker)
          const updated = prev.map(msg => {
            if (msg.id.startsWith('temp-') && msg.role === 'user' && msg.content === data.userMessage?.content) {
              // Update the ID but keep everything else the same
              return { ...msg, id: data.userMessage.id };
            }
            return msg;
          });
          // Add AI response
          return [...updated, data.assistantMessage];
        });
      }
    },
    onError: () => {
      // Remove temporary message on error and refetch
      setLocalMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
      refetch();
    },
  });

  // Edit message mutation
  const editMutation = trpc.chat.editMessage.useMutation({
    onSuccess: (data) => {
      // Update the edited message and replace assistant response
      if (data?.userMessage && data?.assistantMessage) {
        setLocalMessages(prev => {
          // Find the index of the user message being edited
          const userMsgIndex = prev.findIndex(msg => msg.id === data.userMessage.id);
          if (userMsgIndex === -1) return prev;

          // Create new array with updated messages
          const newMessages = [...prev];
          
          // Update user message
          newMessages[userMsgIndex] = data.userMessage;
          
          // Find and remove old assistant message (next message after user message)
          const assistantMsgIndex = newMessages.findIndex(
            (msg, idx) => idx > userMsgIndex && msg.role === 'assistant'
          );
          
          if (assistantMsgIndex !== -1) {
            // Replace old assistant message with new one
            newMessages[assistantMsgIndex] = data.assistantMessage;
          } else {
            // If no assistant message found, add it after user message
            newMessages.splice(userMsgIndex + 1, 0, data.assistantMessage);
          }
          
          return newMessages;
        });
      }
    },
    onError: () => {
      refetch();
    },
  });

  // Delete message mutation
  const deleteMutation = trpc.chat.deleteMessage.useMutation({
    onSuccess: (_, variables) => {
      if (!variables) return;
      
      // Remove the deleted message and its response from local state
      setLocalMessages(prev => {
        const userMsgIndex = prev.findIndex(msg => msg.id === variables.messageId);
        if (userMsgIndex === -1) return prev;

        // Remove user message and the next assistant message
        const newMessages = [...prev];
        newMessages.splice(userMsgIndex, 1);
        
        // Remove the assistant response if it exists at the same index now
        if (newMessages[userMsgIndex]?.role === 'assistant') {
          newMessages.splice(userMsgIndex, 1);
        }
        
        return newMessages;
      });
    },
    onError: () => {
      refetch();
    },
  });

  // Update local messages when server messages change or model changes
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages, selectedModel]);

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
  }, [localMessages]);

  const handleSendMessage = (message: string) => {
    if (!selectedModel) {
      alert('Please select a model first');
      return;
    }

    // Add user message to local state immediately
    const userMessage = {
      id: `temp-${Date.now()}`,
      user_id: session?.user?.id || '',
      model_tag: selectedModel,
      role: 'user' as const,
      content: message,
      created_at: new Date().toISOString(),
    };

    setLocalMessages(prev => [...prev, userMessage]);

    // Send to server
    sendMutation.mutate({
      modelTag: selectedModel,
      prompt: message,
    });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    editMutation.mutate({
      messageId,
      newContent,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMutation.mutate({
      messageId,
    });
  };

  // Find last user message
  const lastUserMessageId = localMessages
    .slice()
    .reverse()
    .find(msg => msg.role === 'user')?.id;

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
    <div className="flex h-screen overflow-hidden w-full">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ChatSidebar />
      
      <main className="flex-1 flex flex-col w-full min-w-0">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden border-b bg-card p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">
            {selectedModel || 'Select a Model'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          <div className="max-w-4xl mx-auto px-2 md:px-8 space-y-4">
            {!selectedModel && (
              <div className="text-center text-muted-foreground py-8">
                Please select an AI model to start chatting
              </div>
            )}

            {localMessages?.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isUser={message.role === 'user'}
                isLastUserMessage={message.role === 'user' && message.id === lastUserMessageId}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                isEditing={editMutation.isLoading}
              />
            ))}

            {(sendMutation.isLoading || editMutation.isLoading) && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
                  <Loader variant="bars" size="sm" />
                  <p className="text-sm text-muted-foreground">
                    {editMutation.isLoading ? 'Regenerating response...' : 'AI is thinking...'}
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
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