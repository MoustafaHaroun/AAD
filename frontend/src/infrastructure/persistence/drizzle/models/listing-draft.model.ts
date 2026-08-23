import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * In-progress create/edit listing form state, autosaved locally so it
 * survives an app kill or accidental back-navigation. `id` is `"new"` for
 * the create-listing draft, or the listing's own id for an edit-in-progress.
 */
export const listingDraft = sqliteTable("listing_draft", {
    id: text().primaryKey(),
    title: text(),
    description: text(),
    category: text(),
    type: text(),
    updatedAt: text("updated_at").notNull(),
});
