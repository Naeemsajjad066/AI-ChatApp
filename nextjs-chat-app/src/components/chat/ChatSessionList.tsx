'use client';

import { useState } from 'react';
import { Plus, MessageSquare, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { trpc } from '@/lib/trpc';
import { useChatStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import type { ChatSession } from '@/types';

interface ChatSessionListProps {
  modelTag?: string;
}

export function ChatSessionList({ modelTag }: ChatSessionListProps) {
  const { getCurrentChatSession, setCurrentChatSession } = useChatStore();
  
  // Get current chat session for this model
  const currentChatSession = getCurrentChatSession(modelTag);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  // Get chat sessions for current model
  const { data: sessions, refetch } = trpc.chatSession.getUserSessions.useQuery(
    { modelTag },
    { enabled: !!modelTag }
  );

  // Create new session mutation
  const createSession = trpc.chatSession.createSession.useMutation({
    onSuccess: (newSession) => {
      setCurrentChatSession(newSession.id);
      refetch();
    },
  });

  // Update session mutation
  const updateSession = trpc.chatSession.updateSession.useMutation({
    onSuccess: () => {
      setEditingSession(null);
      refetch();
    },
  });

  // Delete session mutation
  const deleteSession = trpc.chatSession.deleteSession.useMutation({
    onSuccess: (_, variables) => {
      // If we deleted the current session, clear it
      if (variables && 'sessionId' in variables && variables.sessionId === currentChatSession) {
        setCurrentChatSession(null);
      }
      setDeletingSessionId(null);
      refetch();
    },
    onError: () => {
      setDeletingSessionId(null);
    },
  });

  const handleCreateSession = () => {
    if (!modelTag) return;
    createSession.mutate({ modelTag });
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentChatSession(sessionId);
    setShowMenu(null);
  };

  const handleEditSession = (session: ChatSession) => {
    setEditingSession(session.id);
    setEditTitle(session.title);
    setShowMenu(null);
  };

  const handleSaveEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      updateSession.mutate({
        sessionId,
        title: editTitle.trim(),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      setDeletingSessionId(sessionId);
      deleteSession.mutate({ sessionId });
    }
    setShowMenu(null);
  };

  if (!modelTag) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Select a model to see chat sessions
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Creating Session Loader Overlay */}
      {createSession.isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <Loader
            variant="spinner"
            size="md"
            text="Creating chat session..."
          />
        </div>
      )}

      {/* Deleting Session Loader Overlay */}
      {deletingSessionId && deleteSession.isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <Loader
            variant="spinner"
            size="md"
            text="Deleting chat session..."
          />
        </div>
      )}

      {/* Header with New Chat button */}
      <div className="p-4 border-b">
        <Button
          onClick={handleCreateSession}
          disabled={createSession.isLoading}
          className="w-full flex items-center gap-2"
          size="sm"
        >
          {createSession.isLoading ? (
            <Loader variant="spinner" size="sm" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {createSession.isLoading ? 'Creating...' : 'New Chat'}
        </Button>
      </div>

      {/* Chat Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No chat sessions yet. Start a new chat!
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions?.map((session) => (
              <div
                key={session.id}
                className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-accent ${
                  currentChatSession === session.id 
                    ? 'bg-primary/10 border-2 border-primary/20 shadow-sm' 
                    : 'border-2 border-transparent hover:border-accent'
                }`}
                onClick={() => handleSelectSession(session.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <MessageSquare className={`h-4 w-4 flex-shrink-0 ${
                      currentChatSession === session.id 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                    {currentChatSession === session.id && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                    )}
                  </div>
                  
                  {editingSession === session.id ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 text-sm bg-background border border-input rounded px-2 py-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(session.id);
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleSaveEdit(session.id)}
                        disabled={updateSession.isLoading}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          currentChatSession === session.id 
                            ? 'text-primary font-semibold' 
                            : 'text-foreground'
                        }`}>
                          {session.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(session.updated_at)}
                        </div>
                      </div>

                      {/* Menu button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(showMenu === session.id ? null : session.id);
                        }}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>

                      {/* Dropdown menu */}
                      {showMenu === session.id && (
                        <div className="absolute right-2 top-8 bg-card border rounded-md shadow-lg py-1 z-50 min-w-[120px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSession(session);
                            }}
                            className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                          >
                            <Edit2 className="h-3 w-3" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}