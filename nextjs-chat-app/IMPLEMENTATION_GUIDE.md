# NEXT STEPS AND REMAINING FILES TO CREATE

## Installation Status
The `npm install --legacy-peer-deps` command is currently running. Once complete, follow these steps:

## Files Still Needed

### 1. Chat Components

#### src/components/chat/ChatMessage.tsx
```typescript
'use client';

import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex w-full animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2 shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className="text-xs mt-1 opacity-70">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
```

#### src/components/chat/ChatInput.tsx
```typescript
'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/lib/store';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const { draftMessage, setDraftMessage, clearDraft } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMessage.trim() || isLoading || disabled) return;
    
    onSend(draftMessage);
    clearDraft();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={draftMessage}
        onChange={(e) => setDraftMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] max-h-[200px]"
        disabled={isLoading || disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!draftMessage.trim() || isLoading || disabled}
        className="h-[80px]"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
```

#### src/components/chat/ModelSelector.tsx
```typescript
'use client';

import { Select } from '@/components/ui/Select';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const { data: models, isLoading } = trpc.model.getAvailable.useQuery();

  if (isLoading || !models) {
    return <div className="animate-pulse h-10 bg-muted rounded-md" />;
  }

  const options = models.map((model) => ({
    value: model.tag,
    label: model.name,
  }));

  return (
    <Select
      label="AI Model"
      options={options}
      value={selectedModel || ''}
      onChange={(e) => setSelectedModel(e.target.value)}
    />
  );
}
```

#### src/components/chat/ChatSidebar.tsx
```typescript
'use client';

import { LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';
import { ModelSelector } from './ModelSelector';

export function ChatSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useChatStore();
  
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-4 space-y-4">
          <h2 className="text-xl font-bold">AI Chat</h2>
          
          <ModelSelector />

          <div className="flex-1" />

          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
```

### 2. Page Components

#### src/app/layout.tsx
```typescript
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TRPCProvider } from '@/lib/trpc-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chat App',
  description: 'Chat with multiple AI models',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### src/app/page.tsx
```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Sparkles, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold tracking-tight">
            Chat with AI Models
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose from multiple AI models and have intelligent conversations
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg border bg-card">
              <MessageSquare className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Easy Chatting</h3>
              <p className="text-muted-foreground">
                Simple and intuitive interface for seamless conversations
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Sparkles className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Multiple Models</h3>
              <p className="text-muted-foreground">
                Choose from various AI models to suit your needs
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your conversations are encrypted and stored securely
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 AI Chat App. Built with Next.js, tRPC, and Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
```

#### src/app/auth/login/page.tsx
```typescript
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
```

#### src/app/auth/signup/page.tsx
```typescript
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
```

#### src/app/chat/page.tsx
```typescript
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
```

## Commands to Run After Installation

1. **Check installation completed:**
   ```powershell
   cd "c:\Users\Naeem\OneDrive\Desktop\Chat-App\nextjs-chat-app"
   npm list
   ```

2. **Create .env.local file:**
   ```powershell
   Copy-Item .env.local.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials

3. **Run the development server:**
   ```powershell
   npm run dev
   ```

4. **Open in browser:**
   http://localhost:3000

## Database Setup

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the SQL from `supabase/migrations/001_initial_schema.sql`
4. Verify tables are created in Table Editor

## Testing the App

1. Go to http://localhost:3000
2. Click "Sign Up" and create an account
3. Check your email for verification (if required)
4. Log in
5. Select an AI model
6. Start chatting!

## Troubleshooting

- If you see TypeScript errors, run: `npm run build` to check for real errors
- If Supabase connection fails, verify your environment variables
- If AI responses don't work, add your OPENAI_API_KEY to .env.local
- For module resolution errors, ensure tsconfig.json has proper paths configuration

## Next Enhancements

- Add message editing and deletion UI
- Implement real-time updates with Supabase subscriptions
- Add file upload support
- Create conversation history sidebar
- Add export chat functionality
- Implement streaming responses
- Add voice input/output
