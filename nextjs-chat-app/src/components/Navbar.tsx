"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { trpc } from '@/lib/trpc';

export function Navbar() {
  const router = useRouter();

  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  // If user is authenticated, don't render the navbar at all
  if (!isLoading && session?.user) return null;

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

      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Chat</h1>

          <div className="flex items-center gap-3">
            {/* Theme toggle always shown in the navbar (smaller size) */}
            <ThemeToggle size="sm" />

            <div className="flex gap-2 items-center">
              {!isLoading && session?.user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isLoading}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
