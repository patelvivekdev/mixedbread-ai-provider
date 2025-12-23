import { lazySchema, zodSchema } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

// https://www.mixedbread.com/api-reference/endpoints/reranking/rerank-documents
export type MixedbreadRerankingInput = {
  model: string;
  query: string;
  input: string[];
  rank_fields?: string[];
  top_k: number | undefined;
  return_input: boolean;
  rewrite_query: boolean;
};

export const mixedbreadRerankingResponseSchema = lazySchema(() =>
  zodSchema(
    z.object({
      object: z.literal('list'),
      data: z.array(
        z.object({
          index: z.number(),
          score: z.number(),
          input: z.any().optional(),
          object: z.string().optional(),
        }),
      ),
      model: z.string(),
      usage: z.object({
        prompt_tokens: z.number(),
        total_tokens: z.number(),
        completion_tokens: z.number(),
      }),
      top_k: z.number().optional(),
      return_input: z.boolean().optional(),
    }),
  ),
);
