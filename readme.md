# AI SDK - Mixedbread AI Provider

## Introduction

The Mixedbread AI Provider is a provider for the AI SDK. It provides a simple interface to the Mixedbread AI API.

## Installation

```bash
npm install mixedbread-ai-provider

# or

yarn add mixedbread-ai-provider

# or

pnpm add mixedbread-ai-provider

# or

bun add mixedbread-ai-provider
```

## Configuration

The Mixedbread AI Provider requires an API key to be configured. You can obtain an API key by signing up at [Mixedbread](https://mixedbread.com).

add the following to your `.env` file:

```bash
MIXEDBREAD_API_KEY=your-api-key
```

## Usage

```typescript
import { mixedbread } from 'mixedbread-ai-provider';
import { embedMany } from 'ai';

const embeddingModel = mixedbread.textEmbeddingModel(
  'mixedbread-ai/mxbai-embed-large-v1',
);

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  // Generate chunks from the input value
  const chunks = value.split('\n');

  // Optional: You can also split the input value by comma
  // const chunks = value.split('.');

  // Or you can use LLM to generate chunks(summarize) from the input value

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
```

### Add settings to the model

The settings object should contain the settings you want to add to the model. You can find the available settings for the model in the Mixedbread API documentation: https://www.mixedbread.com/api-reference/endpoints/embeddings

```typescript
const mixedbread = createMixedbread({ apiKey: process.env.MIXEDBREAD_API_KEY });

// Initialize the embedding model
const embeddingModel = mixedbread.textEmbeddingModel(
  'mixedbread-ai/mxbai-embed-large-v1',
);

const embedding = await embed({
  model: embeddingModel,
  value: 'The quick brown fox jumps over the lazy dog',
  providerOptions: {
    mixedbread: {
      prompt: 'Generate embeddings for text', // Max 256 characters
      normalized: true,
      dimensions: 1024, // dimensions
    },
  },
});
```

## Reranking

The Mixedbread AI Provider supports reranking documents using state-of-the-art reranking models. This is useful for improving search results by reordering documents based on their relevance to a query.

### Basic Reranking Example

```typescript
import { rerank } from 'ai';
import { createMixedbread } from 'mixedbread-ai-provider';

const mixedbread = createMixedbread({
  apiKey: process.env.MIXEDBREAD_API_KEY,
});

const result = await rerank({
  model: mixedbread.reranking('mixedbread-ai/mxbai-rerank-large-v2'),
  query: 'Who is the author of To Kill a Mockingbird?',
  documents: [
    'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
    'The novel Moby-Dick was written by Herman Melville and first published in 1851. It is considered a masterpiece of American literature and deals with complex themes of obsession, revenge, and the conflict between good and evil.',
    'Harper Lee, an American novelist widely known for her novel To Kill a Mockingbird, was born in 1926 in Monroeville, Alabama. She received the Pulitzer Prize for Fiction in 1961.',
    'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    'The Harry Potter series, which consists of seven fantasy novels written by British author J.K. Rowling, is among the most popular and critically acclaimed books of the modern era.',
    'The Great Gatsby, a novel written by American author F. Scott Fitzgerald, was published in 1925. The story is set in the Jazz Age and follows the life of millionaire Jay Gatsby and his pursuit of Daisy Buchanan.',
  ],
  topN: 3,
});

console.log('Reranking:', result.ranking);
```

### Available Reranking Models

- `mixedbread-ai/mxbai-rerank-large-v2` - Highest accuracy, supports up to 32k tokens, multilingual
- `mixedbread-ai/mxbai-rerank-base-v2` - Balance between size and performance, supports up to 32k tokens
- `mixedbread-ai/mxbai-rerank-large-v1` - High accuracy, 512 token context
- `mixedbread-ai/mxbai-rerank-base-v1` - Balance between size and performance, 512 token context
- `mixedbread-ai/mxbai-rerank-xsmall-v1` - Capacity-efficient, 512 token context

### Reranking Options

You can customize the reranking behavior using provider options:

```typescript
import { rerank } from 'ai';
import type { MixedbreadRerankingOptions } from 'mixedbread-ai-provider';

const result = await rerank({
  model: mixedbread.reranking('mixedbread-ai/mxbai-rerank-large-v2'),
  query: 'Your search query',
  documents: ['document 1', 'document 2', 'document 3'],
  topN: 5,
  providerOptions: {
    mixedbread: {
      returnInput: true, // Return the input documents in the response
      rewriteQuery: false, // Whether to rewrite the query before reranking
      rankFields: ['title', 'content'], // Fields to use for ranking (for object documents)
    } satisfies MixedbreadRerankingOptions,
  },
});
```

### Reranking with Object Documents

You can also rerank object documents:

```typescript
const result = await rerank({
  model: mixedbread.reranking('mixedbread-ai/mxbai-rerank-large-v2'),
  query: 'Your search query',
  documents: {
    type: 'object',
    values: [
      { title: 'Document 1', content: 'Content 1' },
      { title: 'Document 2', content: 'Content 2' },
    ],
  },
  topN: 2,
});
```

## Authors

- [patelvivekdev](https://patelvivek.dev)
