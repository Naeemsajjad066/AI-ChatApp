-- Add chat sessions table to support multiple conversations per model
-- Each chat session has a title and belongs to a user and model

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_tag TEXT NOT NULL REFERENCES models(tag) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add chat_session_id to messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_model ON chat_sessions(user_id, model_tag);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(chat_session_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own chat sessions
CREATE POLICY "Users can create own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own chat sessions
CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on chat sessions
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_updated_at();

-- Function to auto-generate chat titles based on first message
CREATE OR REPLACE FUNCTION generate_chat_title()
RETURNS TRIGGER AS $$
DECLARE
  first_message TEXT;
BEGIN
  -- Get the first message content for this session
  SELECT content INTO first_message
  FROM messages
  WHERE chat_session_id = NEW.chat_session_id
    AND role = 'user'
  ORDER BY created_at ASC
  LIMIT 1;

  -- Update chat session title if it's still "New Chat" and we have a message
  IF first_message IS NOT NULL THEN
    UPDATE chat_sessions
    SET title = CASE
      WHEN LENGTH(first_message) <= 50 THEN first_message
      ELSE LEFT(first_message, 47) || '...'
    END
    WHERE id = NEW.chat_session_id
      AND title = 'New Chat';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate titles when first message is added
DROP TRIGGER IF EXISTS auto_generate_chat_title ON messages;
CREATE TRIGGER auto_generate_chat_title
  AFTER INSERT ON messages
  FOR EACH ROW
  WHEN (NEW.role = 'user')
  EXECUTE FUNCTION generate_chat_title();