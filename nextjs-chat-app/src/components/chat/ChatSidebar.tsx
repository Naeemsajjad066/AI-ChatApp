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