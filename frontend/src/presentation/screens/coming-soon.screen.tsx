import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

interface ComingSoonScreenProps {
    readonly titleKey: string;
}

export default function ComingSoonScreen({ titleKey }: ComingSoonScreenProps): React.JSX.Element {
    const { t } = useTranslation();
    const title = t(titleKey);

    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, title }} />

            <View className="flex-1 items-center justify-center bg-background px-6">
                <Text className="text-center text-muted-foreground">
                    {t("account.comingSoon", { feature: title })}
                </Text>
            </View>
        </>
    );
}
