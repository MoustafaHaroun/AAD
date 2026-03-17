import type { Listing } from "@/domain/entities";
import type { IListingRepository } from "@/domain/repositories";
import { db } from "@/infrastructure/persistence/drizzle";
import {
    listingSchema,
    attachmentSchema,
} from "@/infrastructure/persistence/drizzle/schema";
import { eq } from "drizzle-orm";

export class ListingRepository implements IListingRepository {
    public async getListingById(listingId: string): Promise<Listing | null> {
        let result;

        try {
            result = await db
                .select({
                    id: listingSchema.id,
                    title: listingSchema.title,
                    description: listingSchema.description,
                    location: listingSchema.location,
                    user: listingSchema.user,
                    attachmentPath: attachmentSchema.path,
                })
                .from(listingSchema)
                .leftJoin(
                    attachmentSchema,
                    eq(attachmentSchema.listingId, listingSchema.id),
                )
                .where(eq(listingSchema.id, listingId));
        } catch (error) {
            console.error(error);
            return null;
        }

        if (result.length <= 0) {
            return null;
        }

        const listing = result[0];

        return {
            id: listing.id,
            title: listing.title ?? "",
            description: listing.description ?? "",
            location: listing.location ?? "",
            user: listing.user ?? "",
            attachments: result
                .map(res => res.attachmentPath)
                .filter(Boolean),
        } satisfies Listing;
    }

    public async getListingsByUser(userId: string): Promise<Listing[]> {
        let result;

        try {
            result = await db
                .select({
                    id: listingSchema.id,
                    title: listingSchema.title,
                    description: listingSchema.description,
                    location: listingSchema.location,
                    user: listingSchema.user,
                    attachmentPath: attachmentSchema.path,
                })
                .from(listingSchema)
                .leftJoin(
                    attachmentSchema,
                    eq(attachmentSchema.listingId, listingSchema.id),
                )
                .where(eq(listingSchema.user, userId));
        } catch (error) {
            console.error(error);
        }

        console.log(result);
        return result?.map(item => ({
            id: item.id,
            title: item.title ?? "",
            description: item.description ?? "",
            location: item.location ?? "",
            user: item.user ?? "",
            attachments: item.attachmentPath,
        })) ?? [] satisfies Listing[];
    }

    public async createListing(
        userId: string,
        listing: Listing,
    ): Promise<Listing> {
        try {
            await db.insert(listingSchema).values(listing);
            await Promise.all(listing.attachments.map(attachment => db.insert(attachmentSchema).values({ id: Date.now().toString(), listingId: listing.id, path: attachment })));
        } catch (error) {
            console.error(error);
        }

        return listing;
    }

    public async deleteListing(listingId: string): Promise<void> {
        try {
            await db.delete(listingSchema).where(eq(listingSchema.id, listingId));
        } catch (error) {
            console.error(error);
        }
    }
}
