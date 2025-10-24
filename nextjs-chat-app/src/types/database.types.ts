// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      models: {
        Row: {
          id: string
          tag: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tag: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tag?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          model_tag: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          model_tag: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          model_tag?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
