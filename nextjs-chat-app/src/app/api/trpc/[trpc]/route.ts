import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

/**
 * Configure basic CORS headers and handle tRPC requests
 */
const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}:`,
              error
            );
            console.error('Error details:', {
              message: error.message,
              code: error.code,
              cause: error.cause,
            });
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };
