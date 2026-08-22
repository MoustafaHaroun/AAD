import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";

interface AppHeaderProps {
    readonly showBack?: boolean,
    readonly right?: React.ReactNode,
}

/**
 * The yellow "Trade²" app bar used on non-tab screens (create/edit listing,
 * etc.), with an optional back button and right-side actions, matching the
 * Figma design system.
 * @param root0
 * @param root0.showBack
 * @param root0.right
 */
export function AppHeader({ showBack = true, right }: AppHeaderProps): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <>
            <SafeAreaView
                className="bg-prim"
                edges={["top"]}
            >
                <View className="items-center justify-center py-3">
                    <Text className="text-[28px] font-noto-bold text-black">Trade²</Text>

                    {showBack
                        ? <Pressable
                                accessibilityLabel={t("common.back")}
                                accessibilityRole="button"
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2"
                                hitSlop={8}
                                onPress={() => { router.back(); }}
                          >
                            <Icon
                                    as={ArrowLeft}
                                    className="size-6 text-black"
                                />
                          </Pressable>
                        : null}

                    {right != null
                        ? <View className="absolute right-4 top-1/2 flex-row items-center gap-1 -translate-y-1/2">
                            {right}
                          </View>
                        : null}
                </View>
            </SafeAreaView>

            <OfflineBanner />
        </>
    );
}
