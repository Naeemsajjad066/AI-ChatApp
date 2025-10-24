import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle size="sm" />
      </div>
      <LoginForm />
    </div>
  );
}