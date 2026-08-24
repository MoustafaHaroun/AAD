import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/persistence/drizzle";
import { listingDraftSchema } from "@/infrastructure/persistence/drizzle/schema";

export interface ListingDraft {
    title?: string,
    description?: string,
    category?: string,
    type?: string,
}

/**
 * Locally-persisted in-progress listing form state (SQLite via Drizzle), so
 * a create/edit listing draft survives an app kill or accidental
 * back-navigation. Keyed by `"new"` for the create-listing draft, or the
 * listing's own id for an edit-in-progress.
 */
export const listingDraftStore = {
    async get(id: string): Promise<ListingDraft | null> {
        try {
            const rows = await db.select().from(listingDraftSchema).where(eq(listingDraftSchema.id, id));
            const row = rows.at(0);

            if (row == null) {
                return null;
            }

            return {
                title: row.title ?? undefined,
                description: row.description ?? undefined,
                category: row.category ?? undefined,
                type: row.type ?? undefined,
            };
        } catch {
            return null;
        }
    },

    async set(id: string, draft: ListingDraft): Promise<void> {
        try {
            await db
                .insert(listingDraftSchema)
                .values({ id, ...draft, updatedAt: new Date().toISOString() })
                .onConflictDoUpdate({
                    target: listingDraftSchema.id,
                    set: { ...draft, updatedAt: new Date().toISOString() },
                });
        } catch (error) {
            console.log(error); // eslint-disable-line no-console
        }
    },

    async clear(id: string): Promise<void> {
        try {
            await db.delete(listingDraftSchema).where(eq(listingDraftSchema.id, id));
        } catch (error) {
            console.log(error); // eslint-disable-line no-console
        }
    },
};
