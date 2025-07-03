import { mixedbread } from '../src/mixedbread-provider';
import { embed } from 'ai';

async function textEmbeddingExamples() {
  const textModel = mixedbread.textEmbeddingModel(
    'mixedbread-ai/mxbai-embed-large-v1',
  );

  const embedding = await embed({
    model: textModel,
    value: 'The quick brown fox jumps over the lazy dog',
  });
  console.log(embedding);
}

textEmbeddingExamples().catch(console.error);
