import { withoutTrailingSlash } from '@ai-sdk/provider-utils';

import { MixedbreadProviderSettings } from '@/mixedbread-provider';
import {
  MixedbreadEmbeddingModelId,
  MixedbreadEmbeddingSettings,
} from './mixedbread-embedding-settings';
import { MixedbreadEmbeddingModel } from './mixedbread-embedding-model';

export class Mixedbread {
  readonly baseURL: string;

  readonly headers?: Record<string, string>;

  constructor(options: MixedbreadProviderSettings = {}) {
    this.baseURL =
      withoutTrailingSlash(options.baseURL) ?? 'https://api.mixedbread.ai';

    this.headers = options.headers;
  }

  private get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        ...this.headers,
      }),
    };
  }

  embedded(
    modelId: MixedbreadEmbeddingModelId,
    settings: MixedbreadEmbeddingSettings = {},
  ) {
    return new MixedbreadEmbeddingModel(modelId, settings, {
      provider: 'mixedbread.embedded',
      ...this.baseConfig,
    });
  }
}
