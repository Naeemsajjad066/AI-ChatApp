import { Database as DB } from './database.types';

export type Database = DB;

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Model = {
  id: string;
  tag: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  model_tag: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

// Type-safe table access
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];