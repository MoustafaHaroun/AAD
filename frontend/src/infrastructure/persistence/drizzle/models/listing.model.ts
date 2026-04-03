import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listing = sqliteTable("listing", {
    id: text().primaryKey(),
    title: text().notNull(),
    description: text(),
    location: text().notNull(),
    user: text().notNull(),
});
