import { listing as listingSchema } from "@/infrastructure/persistence/drizzle/models/listing.model";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const attachment = sqliteTable("attachment", {
    id: text().primaryKey(),
    listingId: text("listing_id")
        .references(() => listingSchema.id, { onDelete: "cascade" })
        .notNull(),
    path: text().notNull(),
});
