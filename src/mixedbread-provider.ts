import type {
  EmbeddingModelV2,
  ImageModelV2,
  LanguageModelV2,
  ProviderV2,
} from '@ai-sdk/provider';
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { MixedbreadEmbeddingModel } from './mixedbread-embedding-model';
import type { MixedbreadEmbeddingModelId } from './mixedbread-embedding-options';

export interface MixedbreadProvider extends ProviderV2 {
  (modelId: MixedbreadEmbeddingModelId): EmbeddingModelV2<string>;

  textEmbeddingModel: (
    modelId: MixedbreadEmbeddingModelId,
  ) => EmbeddingModelV2<string>;
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

  provider.textEmbeddingModel = createEmbeddingModel;

  provider.chat = provider.languageModel = (): LanguageModelV2 => {
    throw new Error('languageModel method is not implemented.');
  };
  provider.imageModel = (): ImageModelV2 => {
    throw new Error('imageModel method is not implemented.');
  };

  return provider as MixedbreadProvider;
}

/**
  Default Mixedbread provider instance.
   */
export const mixedbread = createMixedbread();
