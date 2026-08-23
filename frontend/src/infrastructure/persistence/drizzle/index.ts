import { v4 } from "uuid";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE_NAME = "db.db";

let instance: ReturnType<typeof drizzle> | null = null;

/**
 * Get the shared local SQLite database connection, opening it on first use.
 * @returns The drizzle-wrapped database connection.
 */
function getInstance(): ReturnType<typeof drizzle> {
    if (instance == null) {
        const expo = openDatabaseSync(DATABASE_NAME, {
            enableChangeListener: true,
        });

        instance = drizzle(expo);
    }

    return instance;
}

export const db = getInstance();

/**
 * Generate a random UUID.
 * @returns The generated UUID.
 */
export function uuid(): string {
    return v4();
}
