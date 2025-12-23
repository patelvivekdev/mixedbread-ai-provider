import type {
  EmbeddingModelV3,
  ImageModelV3,
  LanguageModelV3,
  ProviderV3,
  RerankingModelV3,
} from '@ai-sdk/provider';
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { MixedbreadEmbeddingModel } from './mixedbread-embedding-model';
import type { MixedbreadEmbeddingModelId } from './mixedbread-embedding-options';
import type { MixedbreadRerankingModelId } from './reranking/mixedbread-reranking-options';
import { MixedbreadRerankingModel } from './reranking/mixedbread-reranking-model';

export interface MixedbreadProvider extends ProviderV3 {
  (modelId: MixedbreadEmbeddingModelId): EmbeddingModelV3;

  textEmbeddingModel: (modelId: MixedbreadEmbeddingModelId) => EmbeddingModelV3;

  reranking: (modelId: MixedbreadRerankingModelId) => RerankingModelV3;

  rerankingModel: (modelId: MixedbreadRerankingModelId) => RerankingModelV3;
}

export interface MixedbreadProviderSettings {
  /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.mixedbread.com/v1`.
     */
  baseURL?: string;

  /**
  API key that is being send using the `Authorization` header.
  It defaults to the `MIXEDBREAD_API_KEY` environment variable.
     */
  apiKey?: string;

  /**
  Custom headers to include in the requests.
       */
  headers?: Record<string, string>;

  /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
      */
  fetch?: FetchFunction;
}

/**
  Create a Mixedbread AI provider instance.
   */
export function createMixedbread(
  options: MixedbreadProviderSettings = {},
): MixedbreadProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL) ?? 'https://api.mixedbread.com/v1';

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'MIXEDBREAD_API_KEY',
      description: 'Mixedbread',
    })}`,
    ...options.headers,
  });

  const createEmbeddingModel = (modelId: MixedbreadEmbeddingModelId) =>
    new MixedbreadEmbeddingModel(modelId, {
      provider: 'mixedbread.embedding',
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const provider = function (modelId: MixedbreadEmbeddingModelId) {
    if (new.target) {
      throw new Error(
        'The Mixedbread model function cannot be called with the new keyword.',
      );
    }

    return createEmbeddingModel(modelId);
  };

  const createRerankingModel = (modelId: MixedbreadRerankingModelId) =>
    new MixedbreadRerankingModel(modelId, {
      provider: 'mixedbread.reranking',
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  provider.textEmbeddingModel = createEmbeddingModel;

  provider.chat = provider.languageModel = (): LanguageModelV3 => {
    throw new Error('languageModel method is not implemented.');
  };
  provider.imageModel = (): ImageModelV3 => {
    throw new Error('imageModel method is not implemented.');
  };

  provider.reranking = createRerankingModel;
  provider.rerankingModel = createRerankingModel;

  return provider as unknown as MixedbreadProvider;
}

/**
  Default Mixedbread provider instance.
   */
export const mixedbread = createMixedbread();
