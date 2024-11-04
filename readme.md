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

The Mixedbread AI Provider requires an API key to be configured. You can obtain an API key by signing up at [Mixedbread](https://mixedbread.ai).

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
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
```
