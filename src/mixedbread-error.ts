import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';

const mixedbreadErrorDataSchema = z.object({
  error: z.object({
    code: z.string().nullable(),
    message: z.string(),
    param: z.any().nullable(),
    type: z.string(),
  }),
});

export type MixedbreadErrorData = z.infer<typeof mixedbreadErrorDataSchema>;

export const mixedbreadFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: mixedbreadErrorDataSchema,
  errorToMessage: (data) => data.error.message,
});
