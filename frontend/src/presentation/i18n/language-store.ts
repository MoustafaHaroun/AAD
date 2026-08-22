import * as SecureStore from "expo-secure-store";

const SECURE_STORE_KEY = "trade2.language";

export type AppLanguage = "en" | "nl";

class LanguageStore {
    /**
     * Read the persisted language, if any was previously chosen.
     * @returns The stored language, or null if none was set.
     */
    public async get(): Promise<AppLanguage | null> {
        const value = await SecureStore.getItemAsync(SECURE_STORE_KEY);

        return value === "en" || value === "nl" ? value : null;
    }

    /**
     * Persist the chosen language for future app launches.
     * @param language - The language to persist.
     */
    public set(language: AppLanguage): void {
        void SecureStore.setItemAsync(SECURE_STORE_KEY, language);
    }
}

export const languageStore = new LanguageStore();
