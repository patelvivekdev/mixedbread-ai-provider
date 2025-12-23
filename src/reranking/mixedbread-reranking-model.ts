import type { RerankingModelV3, SharedV3Warning } from '@ai-sdk/provider';
import {
  combineHeaders,
  createJsonResponseHandler,
  type FetchFunction,
  parseProviderOptions,
  postJsonToApi,
} from '@ai-sdk/provider-utils';
import { mixedbreadFailedResponseHandler } from '@/mixedbread-error';
import {
  type MixedbreadRerankingInput,
  mixedbreadRerankingResponseSchema,
} from '@/reranking/mixedbread-reranking-api';
import {
  type MixedbreadRerankingModelId,
  mixedbreadRerankingOptionsSchema,
} from '@/reranking/mixedbread-reranking-options';

type MixedbreadRerankingConfig = {
  provider: string;
  baseURL: string;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
};

export class MixedbreadRerankingModel implements RerankingModelV3 {
  readonly specificationVersion = 'v3';
  readonly modelId: MixedbreadRerankingModelId;

  private readonly config: MixedbreadRerankingConfig;

  constructor(
    modelId: MixedbreadRerankingModelId,
    config: MixedbreadRerankingConfig,
  ) {
    this.modelId = modelId;
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  // current implementation is based on the API: https://www.mixedbread.com/api-reference/endpoints/reranking/rerank-documents
  async doRerank({
    documents,
    headers,
    query,
    topN,
    abortSignal,
    providerOptions,
  }: Parameters<RerankingModelV3['doRerank']>[0]): Promise<
    Awaited<ReturnType<RerankingModelV3['doRerank']>>
  > {
    const rerankingOptions = await parseProviderOptions({
      provider: 'mixedbread',
      providerOptions,
      schema: mixedbreadRerankingOptionsSchema,
    });

    const warnings: SharedV3Warning[] = [];

    const {
      responseHeaders,
      value: response,
      rawValue,
    } = await postJsonToApi({
      url: `${this.config.baseURL}/reranking`,
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        query,
        input:
          documents.type === 'text'
            ? documents.values
            : documents.values.map((value) => JSON.stringify(value)),
        rank_fields: rerankingOptions?.rankFields,
        top_k: topN,
        return_input: rerankingOptions?.returnInput ?? false,
        rewrite_query: rerankingOptions?.rewriteQuery ?? false,
      } satisfies MixedbreadRerankingInput,
      failedResponseHandler: mixedbreadFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        mixedbreadRerankingResponseSchema,
      ),
      abortSignal,
      fetch: this.config.fetch,
    });

    return {
      ranking: response.data.map((result) => ({
        index: result.index,
        relevanceScore: result.score,
      })),
      warnings: warnings.length > 0 ? warnings : undefined,
      response: {
        headers: responseHeaders,
        body: rawValue,
      },
    };
  }
}
