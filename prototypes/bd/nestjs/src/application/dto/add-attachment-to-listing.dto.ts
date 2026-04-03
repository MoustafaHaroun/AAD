import { Attachment } from '@/domain/entities';
import { imageSchema } from '@/application/schemas/image.schema';
import { z } from 'zod';

export const addAttachmentToListingSchema = z.object({
  binary: imageSchema,
});

export const addAttachmentToListingApi = {
  schema: {
    type: 'object',
    properties: {
      binaries: {
        type: 'array',
        items: { type: 'string', format: 'binary' },
      },
    },
  },
};

export type AddAttachmentToListingRequest = z.infer<
  typeof addAttachmentToListingSchema
>;

export class AddAttachmentToListingResponse {
  attachment: Attachment;
}
