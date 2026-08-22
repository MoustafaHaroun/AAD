import { v4 } from "uuid";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

/**
 * Lazily opens and memoizes the single local SQLite database connection.
 */
class Database {
    public static DATABASE_NAME: string = "db.db";

    private static instance: ReturnType<typeof drizzle> | null = null;

    /**
     * Get the shared database connection, opening it on first use.
     * @returns The drizzle-wrapped database connection.
     */
    public static getInstance(): ReturnType<typeof drizzle> {
        if (!Database.instance) {
            const expo = openDatabaseSync(Database.DATABASE_NAME, {
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
 * @returns The generated UUID.
 */
export function uuid(): string {
    return v4();
}
