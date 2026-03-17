import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const DATABASE_NAME = "db.db";
const expo = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

export const db = drizzle(expo);
