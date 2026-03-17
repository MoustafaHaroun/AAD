import { v4 } from "uuid";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";


class Database {
    private static instance: ReturnType<typeof drizzle> | null = null;
    public static DATABASE_NAME: string = "db.db";

    static getInstance() {
        if (!Database.instance) {
            const expo = openDatabaseSync(DATABASE_NAME, {
                enableChangeListener: true,
            });
            Database.instance = drizzle(expo);
        }
        return Database.instance;
    }
}

export const DATABASE_NAME = Database.DATABASE_NAME;
export const db = Database.getInstance();

/**
 * Generate a random UUID.
 */
export function uuid(): string {
    return v4();
}