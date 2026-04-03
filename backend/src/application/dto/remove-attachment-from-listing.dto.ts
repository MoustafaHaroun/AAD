import { z } from 'zod';

export const removeAttachmentFromListingSchema = z.object<
  Record<string, unknown>
>({});

export type RemoveAttachmentFromListingRequest = z.infer<
  typeof removeAttachmentFromListingSchema
>;

export type RemoveAttachmentFromListingResponse = void;
