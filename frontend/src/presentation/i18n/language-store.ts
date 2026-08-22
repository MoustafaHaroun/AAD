import * as SecureStore from "expo-secure-store";

const SECURE_STORE_KEY = "trade2.language";

export type AppLanguage = "en" | "nl";

class LanguageStore {
    async get(): Promise<AppLanguage | null> {
        const value = await SecureStore.getItemAsync(SECURE_STORE_KEY);
        return value === "en" || value === "nl" ? value : null;
    }

    set(language: AppLanguage): void {
        void SecureStore.setItemAsync(SECURE_STORE_KEY, language);
    }
}

export const languageStore = new LanguageStore();
