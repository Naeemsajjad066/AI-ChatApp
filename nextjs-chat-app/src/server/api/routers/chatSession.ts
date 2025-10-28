import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const chatSessionRouter = router({
  /**
   * Get all chat sessions for the current user, optionally filtered by model
   */
  getUserSessions: protectedProcedure
    .input(
      z
        .object({
          modelTag: z.string().optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        let query = ctx.supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', ctx.user.id)
          .order('updated_at', { ascending: false })
          .limit(input?.limit || 50);

        // Filter by model tag if provided
        if (input?.modelTag) {
          query = query.eq('model_tag', input.modelTag);
        }

        const { data, error } = await query;

        if (error) {
          console.warn('Database not available for chat sessions, returning empty array:', error.message);
          return [];
        }

        return data || [];
      } catch (err) {
        console.warn('Database not available for chat sessions, returning empty array');
        return [];
      }
    }),

  /**
   * Create a new chat session
   */
  createSession: protectedProcedure
    .input(
      z.object({
        modelTag: z.string().min(1, 'Model tag is required'),
        title: z.string().default('New Chat'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('chat_sessions')
          .insert({
            user_id: ctx.user.id,
            model_tag: input.modelTag,
            title: input.title,
          })
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create chat session',
            cause: error,
          });
        }

        return data;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create chat session',
          cause: err,
        });
      }
    }),

  /**
   * Update a chat session (mainly for title changes)
   */
  updateSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        title: z.string().min(1, 'Title cannot be empty'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First check if the session belongs to the user
        const { data: existingSession } = await ctx.supabase
          .from('chat_sessions')
          .select('user_id')
          .eq('id', input.sessionId)
          .single();

        if (!existingSession || existingSession.user_id !== ctx.user.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found',
          });
        }

        const { data, error } = await ctx.supabase
          .from('chat_sessions')
          .update({
            title: input.title,
          })
          .eq('id', input.sessionId)
          .eq('user_id', ctx.user.id)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update chat session',
            cause: error,
          });
        }

        return data;
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update chat session',
          cause: err,
        });
      }
    }),

  /**
   * Delete a chat session and all its messages
   */
  deleteSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First check if the session belongs to the user
        const { data: existingSession } = await ctx.supabase
          .from('chat_sessions')
          .select('user_id')
          .eq('id', input.sessionId)
          .single();

        if (!existingSession || existingSession.user_id !== ctx.user.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found',
          });
        }

        // Delete the session (messages will be cascade deleted)
        const { error } = await ctx.supabase
          .from('chat_sessions')
          .delete()
          .eq('id', input.sessionId)
          .eq('user_id', ctx.user.id);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete chat session',
            cause: error,
          });
        }

        return { success: true };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete chat session',
          cause: err,
        });
      }
    }),
});