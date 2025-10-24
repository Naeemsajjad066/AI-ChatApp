'use client';

import { Loader } from '@/components/ui/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

/**
 * Loader Showcase Component
 * 
 * This component displays all loader variants and sizes for testing and demonstration.
 * You can temporarily add this to any page to see the loaders in action.
 * 
 * Usage:
 * import { LoaderShowcase } from '@/components/ui/LoaderShowcase';
 * 
 * Then add <LoaderShowcase /> to any page
 */
export function LoaderShowcase() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Beautiful Loaders</h1>
        <p className="text-muted-foreground">
          5 variants × 4 sizes = Infinite possibilities
        </p>
      </div>

      {/* Variants Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Spinner */}
        <Card>
          <CardHeader>
            <CardTitle>Spinner</CardTitle>
            <CardDescription>Classic rotating circle</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Loader variant="spinner" size="sm" />
            <Loader variant="spinner" size="md" />
            <Loader variant="spinner" size="lg" />
            <Loader variant="spinner" size="xl" />
          </CardContent>
        </Card>

        {/* Dots */}
        <Card>
          <CardHeader>
            <CardTitle>Dots</CardTitle>
            <CardDescription>Bouncing dots animation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Loader variant="dots" size="sm" />
            <Loader variant="dots" size="md" />
            <Loader variant="dots" size="lg" />
            <Loader variant="dots" size="xl" />
          </CardContent>
        </Card>

        {/* Pulse */}
        <Card>
          <CardHeader>
            <CardTitle>Pulse</CardTitle>
            <CardDescription>Expanding pulse effect</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Loader variant="pulse" size="sm" />
            <Loader variant="pulse" size="md" />
            <Loader variant="pulse" size="lg" />
            <Loader variant="pulse" size="xl" />
          </CardContent>
        </Card>

        {/* Bars */}
        <Card>
          <CardHeader>
            <CardTitle>Bars</CardTitle>
            <CardDescription>Animated vertical bars</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Loader variant="bars" size="sm" />
            <Loader variant="bars" size="md" />
            <Loader variant="bars" size="lg" />
            <Loader variant="bars" size="xl" />
          </CardContent>
        </Card>

        {/* Ring */}
        <Card>
          <CardHeader>
            <CardTitle>Ring</CardTitle>
            <CardDescription>Dual rotating rings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Loader variant="ring" size="sm" />
            <Loader variant="ring" size="md" />
            <Loader variant="ring" size="lg" />
            <Loader variant="ring" size="xl" />
          </CardContent>
        </Card>
      </div>

      {/* With Text */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">With Text Labels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="py-8">
              <Loader variant="spinner" size="md" text="Loading..." />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <Loader variant="dots" size="md" text="Processing..." />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <Loader variant="ring" size="md" text="Please wait..." />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Login State */}
          <Card>
            <CardHeader>
              <CardTitle>Login Loading</CardTitle>
              <CardDescription>Ring variant with text</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <Loader variant="ring" size="lg" text="Signing you in..." />
            </CardContent>
          </Card>

          {/* AI Thinking */}
          <Card>
            <CardHeader>
              <CardTitle>AI Thinking</CardTitle>
              <CardDescription>Bars variant for processing</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <Loader variant="bars" size="md" text="AI is thinking..." />
            </CardContent>
          </Card>

          {/* Data Loading */}
          <Card>
            <CardHeader>
              <CardTitle>Data Loading</CardTitle>
              <CardDescription>Spinner for general loading</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <Loader variant="spinner" size="lg" text="Loading data..." />
            </CardContent>
          </Card>

          {/* Connecting */}
          <Card>
            <CardHeader>
              <CardTitle>Connecting</CardTitle>
              <CardDescription>Pulse for connection states</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <Loader variant="pulse" size="lg" text="Connecting..." />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Note about fullscreen */}
      <Card className="mt-12 border-primary/50">
        <CardHeader>
          <CardTitle>💡 Fullscreen Mode</CardTitle>
          <CardDescription>
            Add <code className="bg-muted px-2 py-1 rounded">fullscreen</code> prop to any loader for a backdrop overlay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`<Loader
  variant="ring"
  size="lg"
  text="Please wait..."
  fullscreen
/>`}
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            This creates a fixed overlay with backdrop blur, perfect for blocking interactions during critical operations like login/signup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
