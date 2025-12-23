import type { FlexibleSchema } from '@ai-sdk/provider-utils';
import { lazySchema, zodSchema } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

// https://www.mixedbread.com/docs/models/reranking
export type MixedbreadRerankingModelId =
  | 'mixedbread-ai/mxbai-rerank-large-v2'
  | 'mixedbread-ai/mxbai-rerank-base-v2'
  | 'mixedbread-ai/mxbai-rerank-large-v1'
  | 'mixedbread-ai/mxbai-rerank-base-v1'
  | 'mixedbread-ai/mxbai-rerank-xsmall-v1'
  | (string & {});

export type MixedbreadRerankingOptions = {
  /**
   * Whether to return the input documents in the response. Defaults to false.
   *
   * If false, the API will return a list of {"index", "score"} where "index" refers to
   * the index of a document within the input list.
   * If true, the API will return a list of {"index", "score", "input"} where "input"
   * is the corresponding document from the input list.
   *
   * @default false
   */
  returnInput?: boolean;

  /**
   * Whether to rewrite the query before passing it to the reranking model.
   *
   * @default false
   */
  rewriteQuery?: boolean;

  /**
   * The fields of the documents to rank. This is used when input documents are objects
   * and you want to specify which fields should be used for ranking.
   *
   * @default undefined
   */
  rankFields?: string[];
};

export const mixedbreadRerankingOptionsSchema: FlexibleSchema<MixedbreadRerankingOptions> =
  lazySchema(() =>
    zodSchema(
      z.object({
        returnInput: z.boolean().optional(),
        rewriteQuery: z.boolean().optional(),
        rankFields: z.array(z.string()).optional(),
      }),
    ),
  );
