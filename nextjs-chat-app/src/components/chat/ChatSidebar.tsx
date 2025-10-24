'use client';

import { LogOut, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';
import { ModelSelector } from './ModelSelector';

export function ChatSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { isSidebarOpen, setSidebarOpen } = useChatStore();
  
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  return (
    <>
      {/* Logout Loader Overlay */}
      {logoutMutation.isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader
            variant="spinner"
            size="lg"
            text="Logging out..."
          />
        </div>
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* Header with close button for mobile */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">AI Chat</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
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