import { usePathname, useRouter } from "expo-router";
import { ClipboardList, Home, MessageSquare, User } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

const TABS = [
    { href: "/home", key: "home", icon: Home },
    { href: "/listings", key: "listings", icon: ClipboardList },
    { href: "/chats", key: "chats", icon: MessageSquare },
    { href: "/account", key: "account", icon: User },
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

                    return (
                        <Pressable
                            accessibilityLabel={t(`nav.${tab.key}`)}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: active }}
                            className="flex-1 items-center gap-1 pb-2"
                            key={tab.href}
                            onPress={() => { router.push(tab.href); }}
                        >
                            <Icon
                                as={tab.icon}
                                className={cn("size-7", active ? "text-black" : "text-forehued")}
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
