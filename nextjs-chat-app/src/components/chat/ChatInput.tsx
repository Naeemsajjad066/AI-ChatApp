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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={draftMessage}
        onChange={(e) => setDraftMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] md:min-h-[80px] max-h-[200px]"
        disabled={isLoading || disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!draftMessage.trim() || isLoading || disabled}
        className="h-[60px] md:h-[80px] w-[60px] md:w-[80px]"
      >
        <Send className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </form>
  );
}