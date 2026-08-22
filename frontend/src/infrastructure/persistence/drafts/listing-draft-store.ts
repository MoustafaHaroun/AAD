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
    // Draft persistence is a convenience, not a critical path — a broken
    // Local DB (e.g. a pending migration that hasn't run yet on this device)
    // Must never crash or block the actual create/edit listing flow.
    async get(id: string): Promise<ListingDraft | null> {
        try {
            const [row] = await db.select().from(listingDraftSchema).where(eq(listingDraftSchema.id, id));

            if (row == null) { return null; }

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
        } catch {
            // Ignored — see comment above.
        }
    },

    async clear(id: string): Promise<void> {
        try {
            await db.delete(listingDraftSchema).where(eq(listingDraftSchema.id, id));
        } catch {
            // Ignored — see comment above.
        }
    },
};
