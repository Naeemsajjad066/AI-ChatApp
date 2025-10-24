import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { createSupabaseServerClient } from '../db/client';

/**
 * Create context for tRPC requests
 * This runs for every request and provides the context to all procedures
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const supabase = createSupabaseServerClient();
  
  // Get the authenticated user (secure method that verifies with Supabase Auth server)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: user ?? null,
  };
};

// Infer the context type
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 * Throws an error if the user is not logged in
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;