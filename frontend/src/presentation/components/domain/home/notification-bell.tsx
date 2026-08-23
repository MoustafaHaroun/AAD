import * as React from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon, Text } from "@/presentation/components/primitives/rnreusables";
import { useGetNotifications } from "@/presentation/hooks";

const MAX_DISPLAYED_COUNT = 9;

/**
 * Render a bell icon that navigates to the notifications screen and shows the unread count.
 * @returns The rendered notification bell.
 */
export function NotificationBell(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const { data: notifications } = useGetNotifications();
    const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

    return (
        <Pressable
            accessibilityLabel={t("notifications.title")}
            accessibilityRole="button"
            className="p-2"
            hitSlop={8}
            onPress={() => { router.push("/account/notifications"); }}
        >
            <Icon
                as={Bell}
                className="size-6 text-black"
            />

            {unreadCount > 0 &&
                <View className="absolute right-0 top-0 min-w-[18px] items-center justify-center rounded-full bg-destructive px-1">
                    <Text className="text-[11px] font-noto-bold text-destructive-foreground">
                        {unreadCount > MAX_DISPLAYED_COUNT ? `${MAX_DISPLAYED_COUNT}+` : unreadCount}
                    </Text>
                </View>}
        </Pressable>
    );
}
