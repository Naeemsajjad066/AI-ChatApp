-- Insert the new models
INSERT INTO models (tag, name, description) VALUES
  ('gemini', 'Gemini', 'Google''s most capable AI model'),
  ('chatgpt', 'ChatGPT', 'GPT-4 powered by GitHub Models')
ON CONFLICT (tag) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
