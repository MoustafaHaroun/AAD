import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listing = sqliteTable("listing", {
    id: text().primaryKey(),
    title: text(),
    description: text(),
    location: text(),
    user: text(),
});
