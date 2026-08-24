import type { Listing } from "@/domain/entities";
import type { IListingRepository } from "@/domain/repositories";
import { db, uuid } from "@/infrastructure/persistence/drizzle";
import { eq } from "drizzle-orm";
import {
    listingSchema,
    attachmentSchema,
} from "@/infrastructure/persistence/drizzle/schema";

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
        } catch {
            return null;
        }

        if (result.length <= 0) {
            return null;
        }

        return this.reduceListingResults(result)[0];
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
        } catch {}

        return this.reduceListingResults(result);
    }

    public async createListing(
        userId: string,
        listing: Listing,
    ): Promise<Listing> {
        try {
            const listingId = uuid();

            await db.insert(listingSchema).values({ ...listing, id: listingId });
            await Promise.all(listing.attachments.map(attachment => db.insert(attachmentSchema).values({ id: uuid(), listingId, path: attachment })));
        } catch {}

        return listing;
    }

    public async editListing(
        userId: string,
        listing: Listing,
    ): Promise<Listing> {
        try {
            await db
                .update(listingSchema)
                .set({
                    title: listing.title,
                    description: listing.description,
                    location: listing.location,
                    user: listing.user,
                })
                .where(eq(listingSchema.id, listing.id));

            const existing = await db
                .select({
                    id: attachmentSchema.id,
                    path: attachmentSchema.path,
                })
                .from(attachmentSchema)
                .where(eq(attachmentSchema.listingId, listing.id));

            const existingPaths = existing.map(a => a.path);
            const newPaths = listing.attachments;

            const toDelete = existing.filter(a => !newPaths.includes(a.path));
            const toAdd = newPaths.filter(p => !existingPaths.includes(p));

            if (toDelete.length > 0) {
                await Promise.all(
                    toDelete.map(a => db
                        .delete(attachmentSchema)
                        .where(eq(attachmentSchema.id, a.id))),
                );
            }

            if (toAdd.length > 0) {
                await Promise.all(
                    toAdd.map(path => db.insert(attachmentSchema).values({
                        id: uuid(),
                        listingId: listing.id,
                        path,
                    })),
                );
            }

            return listing;
        } catch {
            return listing;
        }
    }

    public async deleteListing(listingId: string): Promise<void> {
        try {
            await db.delete(listingSchema).where(eq(listingSchema.id, listingId));
        } catch {}
    }

    private reduceListingResults(result: Array<{
        id: string,
        title: string,
        description: string | null,
        location: string,
        user: string,
        attachmentPath: string | null,
    }> | undefined): Listing[] {
        return result?.reduce((acc, cur) => {
            const listing = acc.find(item => item.id === cur.id);

            if (cur.attachmentPath != null) {
                if (listing == null) {
                    acc.push({ ...cur, attachments: [cur.attachmentPath] });
                } else {
                    listing.attachments.push(cur.attachmentPath);
                }
            } else if (listing == null) {
                acc.push({ ...cur, attachments: [] });
            }

            return acc;
        }, [] as Listing[]) ?? [];
    }
}
