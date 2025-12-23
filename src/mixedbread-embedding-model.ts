import {
  type EmbeddingModelV3,
  TooManyEmbeddingValuesForCallError,
} from '@ai-sdk/provider';
import {
  combineHeaders,
  createJsonResponseHandler,
  type FetchFunction,
  parseProviderOptions,
  postJsonToApi,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

import { mixedbreadFailedResponseHandler } from '@/mixedbread-error';
import {
  mixedbreadEmbeddingOptions,
  type MixedbreadEmbeddingModelId,
} from './mixedbread-embedding-options';

type MixedbreadEmbeddingConfig = {
  provider: string;
  baseURL: string;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
};

export class MixedbreadEmbeddingModel implements EmbeddingModelV3 {
  readonly specificationVersion = 'v3';
  readonly modelId: MixedbreadEmbeddingModelId;

  private readonly config: MixedbreadEmbeddingConfig;

  get provider(): string {
    return this.config.provider;
  }

  get maxEmbeddingsPerCall(): number {
    return 256;
  }

  get supportsParallelCalls(): boolean {
    return true;
  }

  constructor(
    modelId: MixedbreadEmbeddingModelId,
    config: MixedbreadEmbeddingConfig,
  ) {
    this.modelId = modelId;
    this.config = config;
  }

  async doEmbed({
    abortSignal,
    values,
    headers,
    providerOptions,
  }: Parameters<EmbeddingModelV3['doEmbed']>[0]): Promise<
    Awaited<ReturnType<EmbeddingModelV3['doEmbed']>>
  > {
    const embeddingOptions = await parseProviderOptions({
      provider: 'mixedbread',
      providerOptions,
      schema: mixedbreadEmbeddingOptions,
    });

    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        modelId: this.modelId,
        provider: this.provider,
        values,
      });
    }

    const {
      responseHeaders,
      value: response,
      rawValue,
    } = await postJsonToApi({
      abortSignal,
      body: {
        input: values,
        model: this.modelId,
        prompt: embeddingOptions?.prompt,
        normalize: embeddingOptions?.normalized,
        dimensions: embeddingOptions?.dimensions,
        encoding_format: embeddingOptions?.encodingFormat,
      },
      failedResponseHandler: mixedbreadFailedResponseHandler,
      fetch: this.config.fetch,
      headers: combineHeaders(this.config.headers(), headers),
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
      response: { headers: responseHeaders, body: rawValue },
      warnings: [],
    };
  }
}

// minimal version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const mixedbreadTextEmbeddingResponseSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
  usage: z.object({ total_tokens: z.number() }).nullish(),
});
