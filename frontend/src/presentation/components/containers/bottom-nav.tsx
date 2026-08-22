import { usePathname, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
    HomeTabIcon,
    ListingsTabIcon,
    ChatsTabIcon,
    AccountTabIcon,
} from "@/presentation/components/containers/bottom-nav-icons";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { BRAND_COLORS } from "@/presentation/styles/theme";
import { cn } from "@/presentation/utils/cn.util";

const TABS = [
    { href: "/home", key: "home", icon: HomeTabIcon },
    { href: "/listings", key: "listings", icon: ListingsTabIcon },
    { href: "/chats", key: "chats", icon: ChatsTabIcon },
    { href: "/account", key: "account", icon: AccountTabIcon },
] as const;

/**
 * Persistent bottom tab bar (Home / Listings / Chats / Account) matching the
 * Trade² Figma design system. Custom-built rather than expo-router's `<Tabs>`
 * to match the mockup's exact visual spec.
 */
export function BottomNav(): React.JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <SafeAreaView
            className="bg-white shadow-lg shadow-forehued/25"
            edges={["bottom"]}
        >
            <View className="flex-row pt-2">
                {TABS.map(tab => {
                    const active = pathname.startsWith(tab.href);
                    const IconComponent = tab.icon;

                    return (
                        <Pressable
                            accessibilityLabel={t(`nav.${tab.key}`)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                            className="flex-1 items-center gap-1 pb-2"
                            key={tab.href}
                            onPress={() => { router.push(tab.href); }}
                        >
                            <IconComponent
                                color={active ? BRAND_COLORS.black : BRAND_COLORS.forehued}
                                size={28}
                            />

                            <Text
                                className={cn(
                                    "text-xs",
                                    active ? "font-noto-black text-black" : "font-noto-medium text-forehued",
                                )}
                            >
                                {t(`nav.${tab.key}`)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}
