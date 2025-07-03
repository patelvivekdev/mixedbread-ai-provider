import type {
  EmbeddingModelV1,
  LanguageModelV1,
  ProviderV1,
} from '@ai-sdk/provider';
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { MixedbreadEmbeddingModel } from './mixedbread-embedding-model';
import type {
  MixedbreadEmbeddingModelId,
  MixedbreadEmbeddingSettings,
} from './mixedbread-embedding-settings';

export interface MixedbreadProvider extends ProviderV1 {
  (
    modelId: MixedbreadEmbeddingModelId,
    settings?: MixedbreadEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  /**
  @deprecated Use `textEmbeddingModel()` instead.
     */
  embedding(
    modelId: MixedbreadEmbeddingModelId,
    settings?: MixedbreadEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  /**
  @deprecated Use `textEmbeddingModel()` instead.
     */
  textEmbedding(
    modelId: MixedbreadEmbeddingModelId,
    settings?: MixedbreadEmbeddingSettings,
  ): EmbeddingModelV1<string>;

  textEmbeddingModel: (
    modelId: MixedbreadEmbeddingModelId,
    settings?: MixedbreadEmbeddingSettings,
  ) => EmbeddingModelV1<string>;
}

export interface MixedbreadProviderSettings {
  /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.mixedbread.ai/v1`.
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
    withoutTrailingSlash(options.baseURL) ?? 'https://api.mixedbread.ai/v1';

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'MIXEDBREAD_API_KEY',
      description: 'Mixedbread',
    })}`,
    ...options.headers,
  });

  const createEmbeddingModel = (
    modelId: MixedbreadEmbeddingModelId,
    settings: MixedbreadEmbeddingSettings = {},
  ) =>
    new MixedbreadEmbeddingModel(modelId, settings, {
      provider: 'mixedbread.embedding',
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const provider = function (
    modelId: MixedbreadEmbeddingModelId,
    settings?: MixedbreadEmbeddingSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Mixedbread model function cannot be called with the new keyword.',
      );
    }

    return createEmbeddingModel(modelId, settings);
  };

  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;

  provider.chat = provider.languageModel = (
    modelId: string,
  ): LanguageModelV1 => {
    throw new Error('languageModel method is not implemented.');
  };

  return provider as MixedbreadProvider;
}

/**
  Default Mixedbread provider instance.
   */
export const mixedbread = createMixedbread();
