'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LoaderProps {
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

const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  fullscreen = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div
            className={cn(
              'animate-spin rounded-full border-4 border-primary/30 border-t-primary',
              sizeClasses[size]
            )}
          />
        );

      case 'dots':
        return (
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-primary animate-bounce',
                  size === 'sm' && 'h-2 w-2',
                  size === 'md' && 'h-3 w-3',
                  size === 'lg' && 'h-4 w-4',
                  size === 'xl' && 'h-6 w-6'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <div
              className={cn(
                'rounded-full bg-primary animate-ping absolute opacity-75',
                sizeClasses[size]
              )}
            />
            <div
              className={cn(
                'rounded-full bg-primary relative',
                sizeClasses[size]
              )}
            />
          </div>
        );

      case 'bars':
        return (
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-primary animate-pulse rounded-sm',
                  size === 'sm' && 'w-1 h-4',
                  size === 'md' && 'w-1.5 h-6',
                  size === 'lg' && 'w-2 h-10',
                  size === 'xl' && 'w-3 h-14'
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className="relative">
            <div
              className={cn(
                'rounded-full border-4 border-primary/20',
                sizeClasses[size]
              )}
            />
            <div
              className={cn(
                'absolute top-0 left-0 rounded-full border-4 border-transparent border-t-primary animate-spin',
                sizeClasses[size]
              )}
            />
            <div
              className={cn(
                'absolute top-0 left-0 rounded-full border-4 border-transparent border-r-primary animate-spin',
                sizeClasses[size]
              )}
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const loaderContent = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {renderLoader()}
      {text && (
        <p
          className={cn(
            'text-muted-foreground font-medium animate-pulse',
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

Loader.displayName = 'Loader';

export { Loader };
