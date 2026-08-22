import * as React from "react";
import { Pressable, View } from "react-native";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { setLanguage, type AppLanguage } from "@/presentation/i18n";
import { cn } from "@/presentation/utils/cn.util";

const LANGUAGES: Array<{ value: AppLanguage, labelKey: string, flag: string }> = [
    { value: "en", labelKey: "language.english", flag: "🇬🇧" },
    { value: "nl", labelKey: "language.dutch", flag: "🇳🇱" },
];

/**
 * Render the language preference picker.
 * @returns The rendered preferences screen.
 */
export default function PreferencesScreen(): React.JSX.Element {
    const { t, i18n } = useTranslation();

    return (
        <View className="flex-1 bg-background">
            <AppHeader />

            <View className="p-4">
                <View className="rounded-[10px] bg-surfhued p-4">
                    <Text className="mb-2 text-[20px] font-noto-bold text-forehued">{t("account.menu.language")}</Text>

                    {LANGUAGES.map((language, index) => <Pressable
                            className={cn(
                                "flex-row items-center gap-3 py-3",
                                index > 0 && "border-t border-forehued/20",
                            )}
                            key={language.value}
                            onPress={() => { void setLanguage(language.value); }}
                        >
                            <Text className="text-[24px]">{language.flag}</Text>

                            <Text className="flex-1 font-noto-medium text-[16px] text-forehued">
                                {t(language.labelKey)}
                            </Text>

                            {i18n.language === language.value &&
                                <Icon
                                    as={Check}
                                    className="size-5 text-forehued"
                                />}
                         </Pressable>,)}
                </View>
            </View>
        </View>
    );
}
