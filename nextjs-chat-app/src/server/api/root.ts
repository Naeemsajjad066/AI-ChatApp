import { router } from './trpc';
import { authRouter } from './routers/auth';
import { chatRouter } from './routers/chat';
import { chatSessionRouter } from './routers/chatSession';
import { modelRouter } from './routers/model';

/**
 * Main tRPC router
 * Combines all feature routers
 */
export const appRouter = router({
  auth: authRouter,
  chat: chatRouter,
  chatSession: chatSessionRouter,
  model: modelRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;