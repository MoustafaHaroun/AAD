import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import { useConversations } from "@/presentation/hooks";
import { formatConversationTimestamp } from "@/presentation/utils/format-timestamp.util";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";

/**
 *
 */
export default function ChatsScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const { conversations, isLoading, isFetching, refetch } = useConversations();
    const [query, setQuery] = useState("");

    const filtered = conversations?.filter(({ counterpart }) => `${counterpart.firstname} ${counterpart.surname}`.toLowerCase().includes(query.toLowerCase()));

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

                <View className="p-4">
                    <View className="flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                        <Icon
                            as={Search}
                            className="size-6 text-forehued"
                        />

                        <Input
                            className="h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                            onChangeText={setQuery}
                            placeholder={t("common.search")}
                            value={query}
                        />
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ gap: 8, padding: 16, paddingTop: 0 }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refetch}
                            refreshing={isFetching && !isLoading}
                        />
                    }
                >
                    {isLoading ? <Text className="p-4 text-center text-muted-foreground">{t("common.loading")}</Text> : null}

                    {filtered?.length === 0 &&
                        <Text className="p-4 text-center text-muted-foreground">
                            {t("chats.empty")}
                        </Text>}

                    {filtered?.map(({ counterpart, lastMessage }) => <Pressable
                            className="flex-row items-center gap-3 rounded-[10px] bg-surfhued p-3"
                            key={counterpart.id}
                            onPress={() => { router.push(`/chats/${counterpart.id}`); }}
                        >
                            <UserAvatar
                                avatar={counterpart.avatar}
                                firstname={counterpart.firstname}
                                id={counterpart.id}
                                surname={counterpart.surname}
                            />

                            <View className="flex-1">
                                <View className="flex-row items-center justify-between">
                                    <Text
                                        className="text-[16px] font-noto-semibold text-black"
                                        ellipsizeMode="tail"
                                        numberOfLines={1}
                                    >
                                        {counterpart.firstname} {counterpart.surname}
                                    </Text>

                                    <Text className="text-[14px] font-noto-medium text-forehued">
                                        {formatConversationTimestamp(lastMessage.createdAt, t)}
                                    </Text>
                                </View>

                                <Text
                                    className="text-[14px] font-noto-medium text-forehued"
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                >
                                    {lastMessage.content}
                                </Text>
                            </View>
                         </Pressable>,)}
                </ScrollView>
            </View>
        </>
    );
}
