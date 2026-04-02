import { z } from 'zod';

export const deleteListingSchema = z.object<Record<string, unknown>>({});

export type DeleteListingRequest = z.infer<typeof deleteListingSchema>;

export type DeleteListingResponse = void;
