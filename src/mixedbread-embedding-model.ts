import {
  EmbeddingModelV1,
  TooManyEmbeddingValuesForCallError,
} from '@ai-sdk/provider';
import {
  createJsonResponseHandler,
  postJsonToApi,
} from '@ai-sdk/provider-utils';
import { z } from 'zod';

import {
  MixedbreadEmbeddingModelId,
  MixedbreadEmbeddingSettings,
} from '@/mixedbread-embedding-settings';
import { mixedbreadFailedResponseHandler } from '@/mixedbread-error';

type MixedbreadEmbeddingConfig = {
  baseURL: string;
  fetch?: typeof fetch;
  headers: () => Record<string, string | undefined>;
  provider: string;
};

export class MixedbreadEmbeddingModel implements EmbeddingModelV1<string> {
  readonly specificationVersion = 'v1';
  readonly modelId: MixedbreadEmbeddingModelId;

  private readonly config: MixedbreadEmbeddingConfig;
  private readonly settings: MixedbreadEmbeddingSettings;

  get provider(): string {
    return this.config.provider;
  }

  get maxEmbeddingsPerCall(): number {
    return this.settings.maxEmbeddingsPerCall ?? 512;
  }

  get supportsParallelCalls(): boolean {
    return false;
  }

  constructor(
    modelId: MixedbreadEmbeddingModelId,
    settings: MixedbreadEmbeddingSettings,
    config: MixedbreadEmbeddingConfig,
  ) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }

  async doEmbed({
    abortSignal,
    values,
  }: Parameters<EmbeddingModelV1<string>['doEmbed']>[0]): Promise<
    Awaited<ReturnType<EmbeddingModelV1<string>['doEmbed']>>
  > {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        modelId: this.modelId,
        provider: this.provider,
        values,
      });
    }

    const { responseHeaders, value: response } = await postJsonToApi({
      abortSignal,
      body: {
        input: values,
        model: this.modelId,
      },
      failedResponseHandler: mixedbreadFailedResponseHandler,
      fetch: this.config.fetch,
      headers: this.config.headers(),
      successfulResponseHandler: createJsonResponseHandler(
        mixedbreadTextEmbeddingResponseSchema,
      ),
      url: `${this.config.baseURL}/v1/embeddings`,
    });

    return {
      embeddings: response.embeddings.map(
        (e: { embedding: number[] }) => e.embedding,
      ),
      rawResponse: { headers: responseHeaders },
      usage: {
        tokens: response.usage.total_tokens,
      },
    };
  }
}

const mixedbreadTextEmbeddingResponseSchema = z.object({
  embeddings: z.array(
    z.object({
      embedding: z.array(z.number()),
      index: z.number(),
    }),
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});
