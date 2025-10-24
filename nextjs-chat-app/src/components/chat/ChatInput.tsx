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
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[70px] max-h-[200px] shadow-sm transition-shadow focus-visible:shadow-md"
          disabled={isLoading || disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!draftMessage.trim() || isLoading || disabled}
        className="h-[70px] w-[70px] rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}