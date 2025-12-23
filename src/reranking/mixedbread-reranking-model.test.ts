import { createTestServer } from '@ai-sdk/test-server/with-vitest';
import { createMixedbread } from '@/mixedbread-provider';
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import type { MixedbreadRerankingOptions } from './mixedbread-reranking-options';

const provider = createMixedbread({ apiKey: 'test-api-key' });
const model = provider.rerankingModel('mixedbread-ai/mxbai-rerank-large-v2');

describe('doRerank', () => {
  const server = createTestServer({
    'https://api.mixedbread.com/v1/reranking': {},
  });

  function prepareJsonFixtureResponse(filename: string) {
    server.urls['https://api.mixedbread.com/v1/reranking'].response = {
      type: 'json-value',
      body: JSON.parse(
        fs.readFileSync(`src/reranking/__fixtures__/${filename}.json`, 'utf8'),
      ),
    };
    return;
  }

  describe('json documents', () => {
    let result: Awaited<ReturnType<typeof model.doRerank>>;

    beforeEach(async () => {
      prepareJsonFixtureResponse('mixedbread-reranking.1');

      result = await model.doRerank({
        documents: {
          type: 'object',
          values: [
            { example: 'sunny day at the beach' },
            { example: 'rainy day in the city' },
          ],
        },
        query: 'rainy day',
        topN: 2,
        providerOptions: {
          mixedbread: {
            returnInput: true,
            rewriteQuery: false,
          } satisfies MixedbreadRerankingOptions,
        },
      });
    });

    it('should send request with stringified json documents', async () => {
      expect(await server.calls?.[0]?.requestBodyJson).toMatchInlineSnapshot(`
        {
          "input": [
            "{"example":"sunny day at the beach"}",
            "{"example":"rainy day in the city"}",
          ],
          "model": "mixedbread-ai/mxbai-rerank-large-v2",
          "query": "rainy day",
          "return_input": true,
          "rewrite_query": false,
          "top_k": 2,
        }
      `);
    });

    it('should send request with the correct headers', async () => {
      expect(server.calls?.[0]?.requestHeaders).toMatchInlineSnapshot(`
        {
          "authorization": "Bearer test-api-key",
          "content-type": "application/json",
        }
      `);
    });

    it('should return result with warnings', async () => {
      expect(result.warnings).toMatchInlineSnapshot(`undefined`);
    });

    it('should return result with the correct ranking', async () => {
      expect(result.ranking).toMatchInlineSnapshot(`
        [
          {
            "index": 1,
            "relevanceScore": 0.9876,
          },
          {
            "index": 0,
            "relevanceScore": 0.8765,
          },
        ]
      `);
    });

    it('should not return provider metadata (use response body instead)', async () => {
      expect(result.providerMetadata).toMatchInlineSnapshot(`undefined`);
    });

    it('should return result with the correct response', async () => {
      expect(result.response).toMatchInlineSnapshot(`
        {
          "body": {
            "data": [
              {
                "index": 1,
                "object": "text_document",
                "score": 0.9876,
              },
              {
                "index": 0,
                "object": "text_document",
                "score": 0.8765,
              },
            ],
            "model": "mixedbread-ai/mxbai-rerank-large-v2",
            "object": "list",
            "return_input": false,
            "top_k": 3,
            "usage": {
              "completion_tokens": 823,
              "prompt_tokens": 453,
              "total_tokens": 1276,
            },
          },
          "headers": {
            "content-length": "281",
            "content-type": "application/json",
          },
        }
      `);
    });
  });

  describe('text documents', () => {
    let result: Awaited<ReturnType<typeof model.doRerank>>;

    beforeEach(async () => {
      prepareJsonFixtureResponse('mixedbread-reranking.1');

      result = await model.doRerank({
        documents: {
          type: 'text',
          values: ['sunny day at the beach', 'rainy day in the city'],
        },
        query: 'rainy day',
        topN: 2,
        providerOptions: {
          mixedbread: {
            returnInput: true,
            rewriteQuery: false,
          } satisfies MixedbreadRerankingOptions,
        },
      });
    });

    it('should send request with text documents', async () => {
      expect(await server.calls?.[0]?.requestBodyJson).toMatchInlineSnapshot(`
        {
          "input": [
            "sunny day at the beach",
            "rainy day in the city",
          ],
          "model": "mixedbread-ai/mxbai-rerank-large-v2",
          "query": "rainy day",
          "return_input": true,
          "rewrite_query": false,
          "top_k": 2,
        }
      `);
    });

    it('should send request with the correct headers', async () => {
      expect(server.calls?.[0]?.requestHeaders).toMatchInlineSnapshot(`
        {
          "authorization": "Bearer test-api-key",
          "content-type": "application/json",
        }
      `);
    });

    it('should return result without warnings', async () => {
      expect(result.warnings).toMatchInlineSnapshot(`undefined`);
    });

    it('should return result with the correct ranking', async () => {
      expect(result.ranking).toMatchInlineSnapshot(`
        [
          {
            "index": 1,
            "relevanceScore": 0.9876,
          },
          {
            "index": 0,
            "relevanceScore": 0.8765,
          },
        ]
      `);
    });

    it('should not return provider metadata (use response body instead)', async () => {
      expect(result.providerMetadata).toMatchInlineSnapshot(`undefined`);
    });

    it('should return result with the correct response', async () => {
      expect(result.response).toMatchInlineSnapshot(`
        {
          "body": {
            "data": [
              {
                "index": 1,
                "object": "text_document",
                "score": 0.9876,
              },
              {
                "index": 0,
                "object": "text_document",
                "score": 0.8765,
              },
            ],
            "model": "mixedbread-ai/mxbai-rerank-large-v2",
            "object": "list",
            "return_input": false,
            "top_k": 3,
            "usage": {
              "completion_tokens": 823,
              "prompt_tokens": 453,
              "total_tokens": 1276,
            },
          },
          "headers": {
            "content-length": "281",
            "content-type": "application/json",
          },
        }
      `);
    });
  });
});
