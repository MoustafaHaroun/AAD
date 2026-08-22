import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "@/presentation/i18n/locales/en.json";
import nl from "@/presentation/i18n/locales/nl.json";
import { languageStore, type AppLanguage } from "@/presentation/i18n/language-store";

export type { AppLanguage } from "@/presentation/i18n/language-store";

const resources = {
    en: { translation: en },
    nl: { translation: nl },
};

function detectDeviceLanguage(): AppLanguage {
    return Localization.getLocales()[0]?.languageCode === "nl" ? "nl" : "en";
}

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: detectDeviceLanguage(),
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

/**
 * Restores the user's previously chosen language (if any), otherwise falls
 * back to the device's language. Must be awaited once at app boot.
 */
export async function initLanguage(): Promise<void> {
    const stored = await languageStore.get();
    await i18n.changeLanguage(stored ?? detectDeviceLanguage());
}

export async function setLanguage(language: AppLanguage): Promise<void> {
    languageStore.set(language);
    await i18n.changeLanguage(language);
}

export default i18n;
