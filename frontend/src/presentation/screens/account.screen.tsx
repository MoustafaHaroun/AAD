import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, ChevronRight, Shield, User as UserIcon, ClipboardList, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import { tokenStore } from "@/infrastructure/api";
import { useCurrentUserId, useGetUser } from "@/presentation/hooks";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";

const MENU_ITEMS = [
    { icon: UserIcon, labelKey: "account.menu.personalInformation", href: "/account/settings" as const },
    { icon: ClipboardList, labelKey: "account.menu.myListings", href: { pathname: "/listings", params: { tab: "my" } } as const },
    { icon: Bell, labelKey: "account.menu.notifications", href: "/account/notifications" as const },
    { icon: Shield, labelKey: "account.menu.privacy", href: "/account/privacy" as const },
    { icon: Globe, labelKey: "account.menu.preferences", href: "/account/preferences" as const },
];

/**
 *
 */
export default function AccountScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const currentUserId = useCurrentUserId();
    const { data: user } = useGetUser(currentUserId ?? "");

    /**
     *
     */
    function onLogout() {
        tokenStore.clear();
        queryClient.clear();
        router.replace("/");
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-background">
                <SafeAreaView
                    className="bg-prim"
                    edges={["top"]}
                >
                    <View className="px-4 pb-4 pt-2">
                        <Text className="text-center text-[28px] font-noto-bold text-black">Trade²</Text>
                    </View>
                </SafeAreaView>

                <OfflineBanner />

                <View className="flex-1 p-4">
                    {user != null &&
                        <View className="items-center gap-3">
                            <UserAvatar
                                avatar={user.avatar}
                                firstname={user.firstname}
                                id={user.id}
                                size={100}
                                surname={user.surname}
                            />

                            <Text className="text-[24px] font-noto-bold text-black">
                                {user.firstname} {user.surname}
                            </Text>
                        </View>}

                    <View className="mt-6 rounded-[10px] bg-surfhued p-4">
                        <Text className="mb-2 text-[20px] font-noto-bold text-forehued">{t("account.sectionTitle")}</Text>

                        {MENU_ITEMS.map((item, index) => (<Pressable
                                className={index > 0 ? "flex-row items-center gap-3 border-t border-forehued/20 py-3" : "flex-row items-center gap-3 py-3"}
                                key={item.labelKey}
                                onPress={() => { router.push(item.href); }}
                            >
                                <Icon as={item.icon}
className="size-5 text-forehued" />

                                <Text className="flex-1 font-noto-medium text-[16px] text-forehued">
                                    {t(item.labelKey)}
                                </Text>

                                <Icon as={ChevronRight}
className="size-4 text-forehued" />
                             </Pressable>),)}
                    </View>

                    <View className="flex-1" />

                    <GradientButton onPress={onLogout}>{t("account.logout")}</GradientButton>
                </View>
            </View>
        </>
    );
}
