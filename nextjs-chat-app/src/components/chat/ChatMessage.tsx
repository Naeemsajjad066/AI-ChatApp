'use client';

import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isUser: boolean;
  isLastUserMessage?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  isEditing?: boolean;
}

export function ChatMessage({ 
  message, 
  isUser, 
  isLastUserMessage = false,
  onEdit,
  onDelete,
  isEditing = false
}: ChatMessageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleEdit = () => {
    setShowMenu(false);
    setIsEditMode(true);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() && editedContent !== message.content && onEdit) {
      onEdit(message.id, editedContent.trim());
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedContent(message.content);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in relative group',
        isUser ? 'justify-end' : 'justify-start',
        isUser && 'pr-8'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[75%] rounded-lg px-3 py-2 md:px-4 md:py-2 shadow-sm relative',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {/* Three-dot menu for last user message */}
        {isUser && isLastUserMessage && !isEditMode && (
          <div className="absolute -right-10 top-2 flex items-start">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border rounded-md shadow-lg py-1 z-10 min-w-[120px] whitespace-nowrap">
                <button
                  onClick={handleEdit}
                  disabled={isEditing}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 disabled:opacity-50 text-blue-600 dark:text-blue-400"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isEditing}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 text-destructive disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {isEditMode ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[60px] bg-background text-foreground rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              disabled={isEditing}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isEditing}
                className="h-7 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveEdit}
                disabled={isEditing || !editedContent.trim() || editedContent === message.content}
                className="h-7 px-2"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p className="text-xs mt-1 opacity-70">
              {formatTime(message.created_at)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}