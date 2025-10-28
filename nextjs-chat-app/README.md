# Next.js AI Chat Application

A modern, full-stack chat application that integrates multiple AI models (Google Gemini & GitHub Models GPT-4o) with session management, real-time messaging, and a sleek dark/light theme interface.

## 🚀 Setup (3 Commands)

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

> **Note**: The app includes pre-configured Supabase credentials and works out-of-the-box. For production, replace with your own Supabase project.

## ✨ Features

### Core Features
- 🤖 **Multi-AI Integration**: Switch between Google Gemini 2.0 Flash and GitHub Models (GPT-4o)
- 💬 **Chat Session Management**: Create, rename, delete, and switch between multiple conversations per model
- 🔐 **User Authentication**: Secure signup/login with Supabase Auth
- 📱 **Responsive Design**: Mobile-first UI with collapsible sidebar
- 🌓 **Theme Toggle**: Dark/light mode with persistent preferences
- ⚡ **Real-time Updates**: Instant message rendering with optimistic UI updates
- 💾 **Message Persistence**: Chat history saved to Supabase PostgreSQL
- ✏️ **Message Editing**: Edit previous messages and regenerate AI responses
- 🗑️ **Message Deletion**: Remove messages and their corresponding AI responses
- 🔄 **Loading States**: Visual feedback for all async operations



## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **TanStack Query** for data fetching
- **Lucide React** for icons
- **next-themes** for theme management

### Backend
- **tRPC** for type-safe API routes
- **Supabase** (PostgreSQL + Auth)
- **Zod** for runtime validation
- **SuperJSON** for serialization

### AI Integration
- **Google Gemini 2.0 Flash** via `@google/generative-ai`
- **GitHub Models GPT-4o** via Azure AI Inference SDK

## 🤖 AI API Implementation - How It Works

### Router Pattern
The app uses a **centralized router** in `src/server/api/routers/chat.ts` that directs requests to different AI providers:

```typescript
async function generateAIResponse(modelTag: string, prompt: string) {
  if (modelTag === 'gemini') {
    return await generateGeminiResponse(prompt);      // → Google Gemini API
  }
  if (modelTag === 'chatgpt') {
    return await generateGitHubModelsResponse(prompt); // → GitHub Models (GPT-4o)
  }
  return `You said: ${prompt}`;  // → Echo stub (no API key needed)
}
```

### Stubbing Strategy
**The app gracefully degrades when API keys are missing:**

1. **With API Keys**: Full AI functionality using real models
2. **Without API Keys**: Falls back to an **echo stub** that mirrors user input
3. **On API Errors**: Returns fallback message instead of crashing

**Example stub response:**
```typescript
return `[Gemini not configured] You said: ${prompt}`;
```

This allows the app to be **fully testable and demo-able** without requiring expensive API credentials.

### API Wiring

**Google Gemini** (`src/lib/gemini.ts`):
- SDK: `@google/generative-ai`
- Model: `gemini-2.0-flash-exp`
- Auth: `GEMINI_API_KEY` env variable
- Returns: Direct text response

**GitHub Models GPT-4o** (`src/lib/github-models.ts`):
- SDK: `@azure-rest/ai-inference`
- Endpoint: `https://models.github.ai/inference`
- Auth: `GITHUB_TOKEN` env variable
- Returns: Chat completion response

**Database Integration**:
- User messages saved as `role: 'user'`
- AI responses saved as `role: 'assistant'`
- All messages linked to `chat_session_id`


## Stretch Goals Tackled

### 1. **Multi-Session Chat Management** ✅
**Challenge**: Implement ChatGPT-style conversation management where users can create multiple chat sessions per AI model.

**Solution**:
- Created `chat_sessions` table with user and model relationships
- Built `ChatSessionList` component with CRUD operations
- Implemented session switching with preserved message history
- Auto-title generation from first message
- Added inline editing and delete confirmations

**Technical Hurdles**:
- Handling foreign key constraints across sessions and messages
- Syncing local state (Zustand) with server state (tRPC)
- Preventing race conditions during session creation
- Clearing chat UI when sessions are deleted (fixed with `useEffect` dependency on `currentChatSession`)

### 2. **Message Edit & Regenerate** ✅
**Challenge**: Allow users to edit their messages and automatically regenerate AI responses.

**Solution**:
- Added `editMessage` mutation in chat router
- Implemented context reconstruction from previous messages
- Built edit UI with inline textarea and save/cancel actions
- Only allow editing the last user message (UX best practice)

**Technical Hurdles**:
- Maintaining conversation context when regenerating responses
- Optimistic UI updates without flickering
- Handling concurrent edits and new messages



## 📁 Project Structure

```
src/
├── app/                      # Next.js 14 App Router
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── chat/                 # Main chat interface
│   └── api/trpc/             # tRPC HTTP handler
├── components/
│   ├── auth/                 # Login/Signup forms
│   ├── chat/                 # Chat UI components
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatSessionList.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── ModelSelector.tsx
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── gemini.ts             # Google Gemini integration
│   ├── github-models.ts      # GitHub Models integration
│   ├── store.ts              # Zustand state management
│   ├── trpc.ts               # tRPC client config
│   └── utils.ts              # Helper functions
├── server/
│   ├── api/
│   │   ├── routers/          # tRPC routers
│   │   │   ├── auth.ts       # Authentication endpoints
│   │   │   ├── chat.ts       # Chat message handling
│   │   │   ├── chatSession.ts # Session CRUD
│   │   │   └── model.ts      # Model listing
│   │   ├── root.ts           # Root router
│   │   └── trpc.ts           # tRPC server config
│   └── db/
│       └── client.ts         # Supabase client
└── types/
    ├── database.types.ts     # Supabase generated types
    └── index.ts              # Shared TypeScript types
```

## 🔑 Environment Variables

Create a `.env.local` file with the following:

