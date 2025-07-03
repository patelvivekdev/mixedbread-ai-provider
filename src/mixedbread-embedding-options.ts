import { z } from 'zod/v4';

export type MixedbreadEmbeddingModelId =
  | 'mixedbread-ai/deepset-mxbai-embed-de-large-v1'
  | 'mixedbread-ai/mxbai-embed-large-v1'
  | 'mixedbread-ai/mxbai-embed-2d-large-v1'
  // | 'mxbai-colbert-large-v1'
  | (string & NonNullable<unknown>);

export const mixedbreadEmbeddingOptions = z.object({
  /**
   * An optional prompt to provide context to the model. Refer to the model's documentation for more information.
   * A string between 1 and 256 characters.
   */
  prompt: z.string().optional(),

  /**
   * Option to normalize the embeddings. Defaults to true.
   */
  normalized: z.boolean().optional(),

  /**
   * The desired number of dimensions in the output vectors. Defaults to the model's maximum.
   * A number between 1 and the model's maximum output dimensions.
   * Only applicable for Matryoshka-based models.
   */
  dimensions: z.number().optional(),

  /**
   * The desired format for the embeddings. Defaults to "float". If multiple formats are requested, the response will include an object with each format for each embedding.
   * Options: float, float16, binary, ubinary, int8, uint8, base64.
   */
  encodingFormat: z
    .enum(['float', 'float16', 'binary', 'ubinary', 'int8', 'uint8', 'base64'])
    .optional(),

  /**
   * The strategy for truncating input text that exceeds the model's maximum length. Defaults to "end". Setting it to "none" will result in an error if the text is too long.
   * Options: start, end, none.
   */
  truncationStrategy: z.enum(['start', 'end', 'none']).optional(),

  /**
Override the parallelism of embedding calls.
    */
  supportsParallelCalls: z.boolean().optional(),
});

export type MixedbreadEmbeddingOptions = z.infer<
  typeof mixedbreadEmbeddingOptions
>;
