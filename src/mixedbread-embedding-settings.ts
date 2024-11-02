export type MixedbreadEmbeddingModelId =
  | 'mixedbread-ai/deepset-mxbai-embed-de-large-v1'
  | 'mixedbread-ai/mxbai-embed-large-v1'
  | 'mixedbread-ai/mxbai-embed-2d-large-v1'
  // | 'mxbai-colbert-large-v1'
  | (string & NonNullable<unknown>);

export interface MixedbreadEmbeddingSettings {
  maxEmbeddingsPerCall?: number;
  truncate?: boolean;
}
