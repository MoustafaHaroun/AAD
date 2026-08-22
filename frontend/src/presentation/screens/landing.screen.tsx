import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { SecondaryButton } from "@/presentation/components/primitives/secondary-button";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

/**
 * Render the pre-auth landing screen with sign-in and register entry points.
 * @returns The rendered landing screen.
 */
export default function LandingScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView
                className="flex-1 bg-background"
                edges={["bottom", "top"]}
            >
                <View className="flex-1 items-center justify-center px-6">
                    <Image
                        className="size-[163px] rounded-[24px]"
                        source={require("@/assets/images/logo.png") as number}
                    />

                    <Text className="mt-6 text-[40px] font-noto-bold text-black">Trade²</Text>

                    <View className="mt-4 flex-row items-center gap-3">
                        <View className="size-[10px] rounded-full bg-prim" />

                        <Text className="text-[15px] font-noto text-forehued">
                            {t("landing.tagline")}
                        </Text>

                        <View className="size-[10px] rounded-full bg-prim" />
                    </View>
                </View>

                <View className="gap-3 px-4 pb-4">
                    <GradientButton onPress={() => { router.push("/login"); }}>{t("landing.login")}</GradientButton>

                    <SecondaryButton onPress={() => { router.push("/register"); }}>{t("landing.register")}</SecondaryButton>
                </View>
            </SafeAreaView>
        </>
    );
}
