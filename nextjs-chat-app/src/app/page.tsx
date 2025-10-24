import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Sparkles, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle size="sm" />
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
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
              <MessageSquare className="h-12 w-12 mb-4 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Easy Chatting</h3>
              <p className="text-muted-foreground">
                Simple and intuitive interface for seamless conversations
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Sparkles className="h-12 w-12 mb-4 text-primary mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Multiple Models</h3>
              <p className="text-muted-foreground">
                Choose from various AI models to suit your needs
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Shield className="h-12 w-12 mb-4 text-primary mx-auto" />
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