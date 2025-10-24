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