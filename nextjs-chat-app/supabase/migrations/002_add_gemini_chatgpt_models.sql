-- Add Gemini and ChatGPT models to the models table
-- This allows the foreign key constraint on messages.model_tag to work correctly

-- First, delete old models if they exist
DELETE FROM models WHERE tag IN ('gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo');

-- Insert the new models
INSERT INTO models (tag, name, description) VALUES
  ('gemini', 'Gemini', 'Google''s most capable AI model'),
  ('chatgpt', 'ChatGPT', 'GPT-4 powered by GitHub Models')
ON CONFLICT (tag) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
