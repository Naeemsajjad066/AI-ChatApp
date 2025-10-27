# Gemini Integration Setup

## Quick Start

Your Gemini API key has been added to `.env.local`. The integration is ready to use!

## What Was Changed

1. **Environment Variables** (`.env.local`):
   - Added `GEMINI_API_KEY=AIzaSyAKgR1ghpo7iou79zNf5sjSnqoxo0BGbTI`

2. **Gemini Client** (`src/lib/gemini.ts`):
   - Uses Google's Generative AI SDK
   - Model: `gemini-1.5-pro`
   - Includes error handling and fallbacks

3. **Chat Router** (`src/server/api/routers/chat.ts`):
   - Routes `gemini` tag → Gemini API
   - Routes `chatgpt` tag → OpenAI API (gpt-3.5-turbo)
   - Falls back to echo stub if APIs aren't configured

4. **Model Selector** (`src/components/chat/ModelSelector.tsx`):
   - Filters to show only "Gemini" and "ChatGPT"

5. **Mock Models** (`src/server/api/routers/model.ts`):
   - Updated to show "Gemini" and "ChatGPT" options

## Database Setup (Optional)

To save messages to the database, you need to add the models to your Supabase database:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `supabase/migrations/002_add_gemini_chatgpt_models.sql`

Or copy and paste this SQL:

```sql
-- Add Gemini and ChatGPT models
INSERT INTO models (tag, name, description) VALUES
  ('gemini', 'Gemini', 'Google''s most capable AI model'),
  ('chatgpt', 'ChatGPT', 'OpenAI''s conversational AI model')
ON CONFLICT (tag) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
```

## Testing

1. Restart your dev server (the .env.local changes need a restart)
2. Log in to the app
3. Select "Gemini" from the model selector
4. Send a message - it will be responded to by Gemini!

## Troubleshooting

### "Gemini Error" messages

If you see `[Gemini Error]`, check:
- Dev server was restarted after adding the API key
- API key is correct in `.env.local`
- You have API quota remaining (check Google AI Studio)

### Database foreign key errors

The warnings about foreign key constraints are expected if you haven't run the database migration. The app still works - it just won't save messages to the database. Messages are kept in memory during the session.

To fix: Run the SQL migration mentioned above.

## API Keys

- **Gemini**: Already configured in `.env.local`
- **ChatGPT**: Add `OPENAI_API_KEY=your-key-here` to `.env.local` if you want ChatGPT to work

Without OpenAI key, ChatGPT will echo your messages back.
