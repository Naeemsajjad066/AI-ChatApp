-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_tag TEXT NOT NULL REFERENCES models(tag) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_model_tag ON messages(model_tag);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_model ON messages(user_id, model_tag);

-- Enable Row Level Security (RLS)
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for models table
-- Everyone can read models
CREATE POLICY "Models are viewable by everyone"
  ON models FOR SELECT
  USING (true);

-- Only authenticated users can insert models (optional, for admin use)
CREATE POLICY "Authenticated users can insert models"
  ON models FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for messages table
-- Users can only see their own messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = user_id);

-- Seed initial models
INSERT INTO models (tag, name, description) VALUES
  ('gpt-4o', 'GPT-4 Optimized', 'Most capable model for complex tasks'),
  ('gpt-4-turbo', 'GPT-4 Turbo', 'Fast and efficient GPT-4 variant'),
  ('gpt-3.5-turbo', 'GPT-3.5 Turbo', 'Fast and cost-effective model'),
  ('claude-3-opus', 'Claude 3 Opus', 'Most capable Claude model'),
  ('claude-3-sonnet', 'Claude 3 Sonnet', 'Balanced performance and speed')
ON CONFLICT (tag) DO NOTHING;
