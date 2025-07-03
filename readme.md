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
  // adding settings
  {
    prompt: 'Generate embeddings for text', // Max 256 characters
    normalized: true,
    dimensions: 768, // Max model dimensions
    truncationStrategy: 'end',
  },
);
```

## Authors

- [patelvivekdev](https://patelvivek.dev)
