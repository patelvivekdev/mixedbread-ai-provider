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
    return 512;
  }

  get supportsParallelCalls(): boolean {
    return this.settings.supportsParallelCalls ?? false;
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
      url: `${this.config.baseURL}/embeddings`,
    });

    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage
        ? { tokens: response.usage.total_tokens }
        : undefined,
      rawResponse: { headers: responseHeaders },
    };
  }
}

// minimal version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const mixedbreadTextEmbeddingResponseSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ total_tokens: z.number() }).nullish(),
});
