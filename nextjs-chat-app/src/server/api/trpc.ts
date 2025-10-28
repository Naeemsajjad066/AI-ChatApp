import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { createSupabaseServerClient } from '../db/client';


export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const supabase = createSupabaseServerClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: user ?? null,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;


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


export const createCallerFactory = t.createCallerFactory;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;


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