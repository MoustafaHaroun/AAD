import * as React from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Icon, Text } from "@/presentation/components/primitives/rnreusables";
import { useDeleteNotification, useGetNotifications, useNetworkStatus, useUpdateNotification } from "@/presentation/hooks";
import { formatConversationTimestamp } from "@/presentation/utils/format-timestamp.util";
import { cn } from "@/presentation/utils/cn.util";
import type { Notification } from "@/domain/entities";

/**
 * Render the notifications list, letting the user mark items read or delete them.
 * @returns The rendered notifications screen.
 */
export default function NotificationsScreen(): React.JSX.Element {
    const { t } = useTranslation();
    const { data: notifications, isLoading, isFetching, error, refetch } = useGetNotifications();
    const { mutate: updateNotification } = useUpdateNotification();
    const { mutate: deleteNotification } = useDeleteNotification();
    const isOnline = useNetworkStatus();

    /**
     * Mark a notification as read when it's opened, if it isn't already.
     * @param notification - The notification that was pressed.
     */
    function onPressNotification(notification: Notification): void {
        if (!notification.read) {
            updateNotification({ id: notification.id, read: true });
        }
    }

    return (
        <View className="flex-1 bg-background">
            <AppHeader />

            <Text className="px-4 pb-2 pt-4 text-[20px] font-noto-bold text-black">
                {t("notifications.title")}
            </Text>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ gap: 8, padding: 16, paddingTop: 0, flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => { void refetch(); }}
                        refreshing={isFetching ? !isLoading : false}
                    />
                }
            >
                {isLoading
                    ? <Text className="p-4 text-center text-muted-foreground">{t("common.loading")}</Text>
                    : null}

                {error != null && notifications == null &&
                    <Text className="p-4 text-center text-sm text-destructive">
                        {isOnline ? t("common.loadError") : t("common.notAvailableOffline")}
                    </Text>}

                {notifications?.length === 0 &&
                    <Text className="p-4 text-center text-muted-foreground">
                        {t("notifications.empty")}
                    </Text>}

                {notifications?.map(notification => <Pressable
                    className={cn(
                        "flex-row items-center gap-3 rounded-[10px] bg-surfhued p-3",
                        !notification.read && "border-l-4 border-prim",
                    )}
                    key={notification.id}
                    onPress={() => { onPressNotification(notification); }}
                >
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between gap-2">
                            <Text
                                className={cn(
                                    "flex-1 text-[16px] text-black",
                                    notification.read ? "font-noto-medium" : "font-noto-bold",
                                )}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {notification.title}
                            </Text>

                            <Text className="text-[13px] font-noto-medium text-forehued">
                                {formatConversationTimestamp(notification.createdAt, t)}
                            </Text>
                        </View>

                        <Text
                            className="text-[14px] font-noto-medium text-forehued"
                            ellipsizeMode="tail"
                            numberOfLines={2}
                        >
                            {notification.message}
                        </Text>
                    </View>

                    <Pressable
                        accessibilityLabel={t("common.delete")}
                        accessibilityRole="button"
                        className="p-2"
                        hitSlop={8}
                        onPress={() => { deleteNotification({ id: notification.id }); }}
                    >
                        <Icon
                            as={Trash2}
                            className="size-5 text-destructive"
                        />
                    </Pressable>
                </Pressable>)}
            </ScrollView>
        </View>
    );
}
