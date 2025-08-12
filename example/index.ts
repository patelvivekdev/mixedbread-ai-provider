import { mixedbread } from '../src/mixedbread-provider';
import { embed } from 'ai';
import type { MixedbreadEmbeddingOptions } from '../src/mixedbread-embedding-options';

async function textEmbeddingExamples() {
  const textModel = mixedbread.textEmbeddingModel(
    'mixedbread-ai/mxbai-embed-large-v1',
  );

  const embedding = await embed({
    model: textModel,
    value: 'The quick brown fox jumps over the lazy dog',
    providerOptions: {
      mixedbread: {
        prompt: 'Generate embeddings for text',
        dimensions: 3,
      } as MixedbreadEmbeddingOptions,
    },
  });
  console.log(embedding);
}

textEmbeddingExamples().catch(console.error);
