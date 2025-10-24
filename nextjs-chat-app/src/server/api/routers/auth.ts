import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  /**
   * Sign up a new user
   */
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      if (!data.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        },
        message: 'Sign up successful! Please check your email to verify your account.',
      };
    }),

  /**
   * Log in an existing user
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      if (!data.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
        },
      };
    }),

  /**
   * Log out the current user
   */
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const { error } = await ctx.supabase.auth.signOut();

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }

    return { success: true };
  }),

  /**
   * Get the current user session
   */
  getSession: publicProcedure.query(async ({ ctx }) => {
    const {
      data: { session },
    } = await ctx.supabase.auth.getSession();

    if (!session) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at,
      },
      expires_at: session.expires_at,
    };
  }),

  /**
   * Get the current authenticated user
   */
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email!,
      created_at: ctx.user.created_at,
    };
  }),
});