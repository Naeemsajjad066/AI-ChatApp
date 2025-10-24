import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import OpenAI from 'openai';

// Initialize OpenAI client (optional - will use stub if no API key)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/**
 * Generate AI response using OpenAI or echo stub
 */
async function generateAIResponse(
  modelTag: string,
  prompt: string
): Promise<string> {
  // If OpenAI is configured, use it
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: modelTag,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to echo stub on error
      return `[OpenAI Error] You said: ${prompt}`;
    }
  }

  // Echo stub fallback
  return `You said: ${prompt}`;
}

export const chatRouter = router({
  /**
   * Get chat history for the current user
   * Optionally filter by model tag
   */
  history: protectedProcedure
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
          .from('messages')
          .select('*')
          .eq('user_id', ctx.user.id)
          .order('created_at', { ascending: false })
          .limit(input?.limit || 50);

        // Filter by model tag if provided
        if (input?.modelTag) {
          query = query.eq('model_tag', input.modelTag);
        }

        const { data, error } = await query;

        if (error) {
          console.warn('Database not available for chat history, returning empty array');
          return [];
        }

        const messages = data || [];
        
        // Return in chronological order
        return messages.reverse().map((msg) => ({
          id: msg.id,
          user_id: msg.user_id,
          model_tag: msg.model_tag,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          created_at: msg.created_at,
        }));
      } catch (err) {
        console.warn('Database not available for chat history, returning empty array');
        return [];
      }
    }),

  /**
   * Send a message and get AI response
   */
  send: protectedProcedure
    .input(
      z.object({
        modelTag: z.string().min(1, 'Model tag is required'),
        prompt: z.string().min(1, 'Message cannot be empty'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate AI response immediately (works with or without database)
      const aiResponse = await generateAIResponse(input.modelTag, input.prompt);

      // Try to save to database, but don't fail if database is unavailable
      try {
        // Save user message
        const { data: userMessage, error: userMessageError } = await ctx.supabase
          .from('messages')
          .insert({
            user_id: ctx.user.id,
            model_tag: input.modelTag,
            role: 'user',
            content: input.prompt,
          })
          .select()
          .single();

        if (userMessageError) {
          console.warn('Could not save user message to database:', userMessageError.message);
        }

        // Save AI response
        const { data: assistantMessage, error: assistantMessageError } =
          await ctx.supabase
            .from('messages')
            .insert({
              user_id: ctx.user.id,
              model_tag: input.modelTag,
              role: 'assistant',
              content: aiResponse,
            })
            .select()
            .single();

        if (assistantMessageError) {
          console.warn('Could not save assistant message to database:', assistantMessageError.message);
        }

        // If database save succeeded, return with IDs
        if (userMessage && assistantMessage) {
          return {
            userMessage: {
              id: userMessage.id,
              user_id: userMessage.user_id,
              model_tag: userMessage.model_tag,
              role: userMessage.role as 'user',
              content: userMessage.content,
              created_at: userMessage.created_at,
            },
            assistantMessage: {
              id: assistantMessage.id,
              user_id: assistantMessage.user_id,
              model_tag: assistantMessage.model_tag,
              role: assistantMessage.role as 'assistant',
              content: assistantMessage.content,
              created_at: assistantMessage.created_at,
            },
          };
        }
      } catch (err) {
        console.warn('Database not available, returning in-memory response');
      }

      // Fallback: return messages without database IDs
      const now = new Date().toISOString();
      return {
        userMessage: {
          id: `temp-user-${Date.now()}`,
          user_id: ctx.user.id,
          model_tag: input.modelTag,
          role: 'user' as const,
          content: input.prompt,
          created_at: now,
        },
        assistantMessage: {
          id: `temp-assistant-${Date.now()}`,
          user_id: ctx.user.id,
          model_tag: input.modelTag,
          role: 'assistant' as const,
          content: aiResponse,
          created_at: now,
        },
      };
    }),

  /**
   * Delete a message (user can only delete their own messages)
   */
  deleteMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the message belongs to the user
      const { data: message, error: fetchError } = await ctx.supabase
        .from('messages')
        .select('user_id')
        .eq('id', input.messageId)
        .single();

      if (fetchError || !message) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Message not found',
        });
      }

      if (message.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own messages',
        });
      }

      // Delete the message
      const { error: deleteError } = await ctx.supabase
        .from('messages')
        .delete()
        .eq('id', input.messageId);

      if (deleteError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete message',
          cause: deleteError,
        });
      }

      return { success: true };
    }),
});