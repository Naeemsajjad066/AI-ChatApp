# 🎨 Beautiful Loader Component

## Overview

A modern, customizable loading component with multiple variants, sizes, and fullscreen overlay support. Perfect for login, signup, data fetching, and any async operations.

## ✨ Features

- **5 Beautiful Variants**: Spinner, Dots, Pulse, Bars, Ring
- **4 Sizes**: Small, Medium, Large, Extra Large
- **Fullscreen Overlay**: Optional backdrop blur effect
- **Custom Text**: Display loading messages
- **Smooth Animations**: Professional transitions
- **Dark Mode Support**: Works with theme provider
- **TypeScript**: Full type safety
- **Responsive**: Adapts to all screen sizes

## 🎯 Usage

### Basic Usage

```tsx
import { Loader } from '@/components/ui/Loader';

// Simple loader
<Loader />

// With text
<Loader text="Loading..." />

// Fullscreen overlay
<Loader fullscreen text="Please wait..." />
```

### Variants

#### 1. **Spinner** (Default)
Classic spinning circle - great for general loading

```tsx
<Loader variant="spinner" size="md" />
```

#### 2. **Dots**
Three bouncing dots - perfect for "typing" or "processing" states

```tsx
<Loader variant="dots" size="md" text="AI is typing..." />
```

#### 3. **Pulse**
Expanding pulse effect - ideal for waiting states

```tsx
<Loader variant="pulse" size="lg" text="Connecting..." />
```

#### 4. **Bars**
Animated bars - excellent for "processing" or "thinking"

```tsx
<Loader variant="bars" size="md" text="Processing..." />
```

#### 5. **Ring**
Dual rotating rings - modern and eye-catching

```tsx
<Loader variant="ring" size="lg" text="Loading data..." />
```

### Sizes

```tsx
<Loader size="sm" />   // Small (6x6)
<Loader size="md" />   // Medium (10x10) - Default
<Loader size="lg" />   // Large (16x16)
<Loader size="xl" />   // Extra Large (24x24)
```

### Fullscreen Overlay

Perfect for blocking interactions during critical operations:

```tsx
<Loader
  variant="ring"
  size="lg"
  text="Signing you in..."
  fullscreen
/>
```

This creates:
- Fixed position overlay
- Backdrop blur effect
- Centered loader
- Blocks all interactions
- z-index: 50

## 📦 Implementation Examples

### 1. Login/Signup Forms

```tsx
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && (
        <Loader
          variant="ring"
          size="lg"
          text="Signing you in..."
          fullscreen
        />
      )}
      
      <form>
        {/* Form fields */}
        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader variant="dots" size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </>
  );
}
```

### 2. Chat Page Loading

```tsx
export default function ChatPage() {
  const { isLoading } = trpc.chat.history.useQuery();

  if (isLoading) {
    return (
      <Loader
        variant="spinner"
        size="lg"
        text="Loading chat..."
        fullscreen
      />
    );
  }

  return <ChatInterface />;
}
```

### 3. AI Thinking State

```tsx
{sendMutation.isLoading && (
  <div className="flex justify-start">
    <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-3">
      <Loader variant="bars" size="sm" />
      <p className="text-sm text-muted-foreground">AI is thinking...</p>
    </div>
  </div>
)}
```

### 4. Button Loading State

```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader variant="dots" size="sm" className="mr-2" />
      Processing...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### 5. Page Transition

```tsx
const router = useRouter();
const [isNavigating, setIsNavigating] = useState(false);

const handleNavigate = () => {
  setIsNavigating(true);
  router.push('/dashboard');
};

return (
  <>
    {isNavigating && (
      <Loader
        variant="pulse"
        size="lg"
        text="Redirecting..."
        fullscreen
      />
    )}
    <button onClick={handleNavigate}>Go to Dashboard</button>
  </>
);
```

## 🎨 Customization

### Custom Styling

```tsx
<Loader
  variant="spinner"
  size="md"
  className="my-custom-class"
/>
```

### Custom Text Styling

The text automatically:
- Adjusts size based on loader size
- Animates with pulse effect
- Uses muted-foreground color
- Medium font weight

## 🔧 Props API

```typescript
interface LoaderProps {
  /** Loader variant style */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
  
  /** Size of the loader */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Optional text to display below loader */
  text?: string;
  
  /** Show as fullscreen overlay */
  fullscreen?: boolean;
  
  /** Custom className */
  className?: string;
}
```

## 🎯 Use Cases by Variant

| Variant | Best For |
|---------|----------|
| **Spinner** | General loading, page transitions, data fetching |
| **Dots** | Typing indicators, processing text, AI responses |
| **Pulse** | Connection states, waiting, initialization |
| **Bars** | Audio/video processing, data analysis, AI thinking |
| **Ring** | Authentication, important operations, form submissions |

## 📱 Responsive Behavior

The loader automatically adapts:
- Text size scales with loader size
- Fullscreen overlay works on all devices
- Touch-friendly (no accidental clicks through overlay)
- Works with mobile keyboards

## 🎨 Design Principles

1. **Smooth Animations**: All variants use CSS animations for 60fps performance
2. **Accessibility**: Uses semantic HTML and ARIA-friendly structure
3. **Theme Aware**: Respects light/dark mode via Tailwind
4. **Non-blocking**: Inline loaders don't disrupt layout
5. **Blocking**: Fullscreen loaders prevent interaction when needed

## 🚀 Performance

- **Lightweight**: Pure CSS animations, no heavy JavaScript
- **Optimized**: Uses Tailwind utilities for minimal CSS
- **No Dependencies**: Built with React only
- **Tree Shakeable**: Import only what you need

## 🔍 Common Patterns

### Pattern 1: Form Submission
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  await api.submit();
  setIsSubmitting(false);
};

return (
  <>
    {isSubmitting && (
      <Loader variant="ring" size="lg" text="Submitting..." fullscreen />
    )}
    <Form onSubmit={handleSubmit} />
  </>
);
```

### Pattern 2: Conditional Rendering
```tsx
{isLoading ? (
  <Loader variant="spinner" size="lg" text="Loading..." fullscreen />
) : (
  <Content />
)}
```

### Pattern 3: Button State
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <Loader variant="dots" size="sm" className="mr-2" />
  ) : null}
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

## ✅ Where It's Currently Used

1. **LoginForm** (`src/components/auth/LoginForm.tsx`)
   - Fullscreen: Ring variant during sign in
   - Button: Dots variant for button state

2. **SignupForm** (`src/components/auth/SignupForm.tsx`)
   - Fullscreen: Pulse variant during account creation
   - Button: Dots variant for button state

3. **ChatPage** (`src/app/chat/page.tsx`)
   - Fullscreen: Spinner variant for initial load
   - Inline: Bars variant for AI thinking state

## 🎉 Benefits

✅ **Consistent UX** - Same loader style across app
✅ **Professional** - Modern, smooth animations
✅ **Flexible** - 5 variants for different contexts
✅ **Easy to Use** - Simple props API
✅ **Accessible** - Works with screen readers
✅ **Performant** - CSS-only animations
✅ **Theme-Aware** - Auto adapts to dark/light mode

## 🔮 Future Enhancements

- [ ] Add custom color support
- [ ] Add progress percentage display
- [ ] Add skeleton loading variant
- [ ] Add linear progress bar variant
- [ ] Add confetti celebration variant
- [ ] Add custom animation speeds

---

**Created**: October 2025  
**Location**: `src/components/ui/Loader.tsx`  
**Status**: ✅ Production Ready
