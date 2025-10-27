import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Mock data for testing without database
const MOCK_MODELS = [
  {
    id: '1',
    tag: 'gemini',
    name: 'Gemini',
    description: 'Google\'s most capable AI model',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    tag: 'chatgpt',
    name: 'ChatGPT',
    description: 'GPT-4 powered by GitHub Models',
    created_at: new Date().toISOString(),
  },
];

export const modelRouter = router({
  /**
   * Get all available AI models
   * This returns a list of model tags that users can choose from
   */
  getAvailable: publicProcedure.query(async ({ ctx }) => {
    // Try database first, fall back to mock data
    try {
      const { data, error } = await ctx.supabase
        .from('models')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Database not available, using mock data:', error.message);
        return MOCK_MODELS;
      }

      if (data && data.length > 0) {
        return data.map((model) => ({
          id: model.id,
          tag: model.tag,
          name: model.name,
          description: model.description,
          created_at: model.created_at,
        }));
      }

      return MOCK_MODELS;
    } catch (err) {
      console.warn('Database not available, using mock data');
      return MOCK_MODELS;
    }
  }),

  /**
   * Get a specific model by tag
   */
  getByTag: publicProcedure
    .input(
      z.object({
        tag: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Try database first, fall back to mock data
      try {
        const { data, error } = await ctx.supabase
          .from('models')
          .select('*')
          .eq('tag', input.tag)
          .single();

        if (error) {
          const mockModel = MOCK_MODELS.find((m) => m.tag === input.tag);
          if (!mockModel) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Model not found',
            });
          }
          return mockModel;
        }

        return {
          id: data.id,
          tag: data.tag,
          name: data.name,
          description: data.description,
          created_at: data.created_at,
        };
      } catch (err) {
        const mockModel = MOCK_MODELS.find((m) => m.tag === input.tag);
        if (!mockModel) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Model not found',
          });
        }
        return mockModel;
      }
    }),
});