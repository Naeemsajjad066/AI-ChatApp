// Common types used across the app
export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  user_id: string;
  model_tag: string;
  chat_session_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface AIModel {
  id: string;
  tag: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  model_tag: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionWithMessages {
  session: ChatSession;
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: UserProfile | null;
  error?: string;
}