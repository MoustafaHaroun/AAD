import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { QuickActionTile } from "@/presentation/components/domain/home/quick-action-tile";
import {
    AccountIcon,
    ChatsIcon,
    MyListingsIcon,
    NewListingIcon,
} from "@/presentation/components/domain/home/quick-action-icons";
import { NotificationBell } from "@/presentation/components/domain/home/notification-bell";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";
import { useConversations, useCurrentUserId, useGetApiListings, useGetUser } from "@/presentation/hooks";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";

const CHATS_PREVIEW_LIMIT = 5;

const NEW_LISTINGS_LIMIT = 4;

/**
 * Render the home screen with search, quick actions, chat previews, and new listings.
 * @returns The rendered home screen.
 */
export default function HomeScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const currentUserId = useCurrentUserId();
    const { data: currentUser } = useGetUser(currentUserId ?? "");
    const { data: listings, isFetching: isFetchingListings, refetch: refetchListings } = useGetApiListings();
    const { conversations, isFetching: isFetchingConversations, refetch: refetchConversations } = useConversations();
    const newListings = listings?.slice(0, NEW_LISTINGS_LIMIT) ?? [];
    const recentConversations = conversations?.slice(0, CHATS_PREVIEW_LIMIT) ?? [];

    /**
     * Navigate to the listings screen, carrying the search query if one was entered.
     */
    function onSearchSubmit(): void {
        router.push(query.trim().length > 0 ? { pathname: "/listings", params: { q: query.trim() } } : "/listings");
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
                        <View className="relative items-center justify-center">
                            <Text className="text-center text-[28px] font-noto-bold text-black">Trade²</Text>

                            <View className="absolute right-0 top-1/2 -translate-y-1/2">
                                <NotificationBell />
                            </View>
                        </View>

                        <View className="mt-4 flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                            <Icon
                                as={Search}
                                className="size-6 text-forehued"
                            />

                            <Input
                                className="h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                                onChangeText={setQuery}
                                onSubmitEditing={onSearchSubmit}
                                placeholder={t("common.search")}
                                returnKeyType="search"
                                value={query}
                            />
                        </View>
                    </View>
                </SafeAreaView>

                <OfflineBanner />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, gap: 16 }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => { void refetchListings(); void refetchConversations(); }}
                            refreshing={isFetchingListings || isFetchingConversations}
                        />
                    }
                >
                    <View className="flex-row gap-2">
                        <QuickActionTile
                            icon={NewListingIcon}
                            label={t("home.newListing")}
                            onPress={() => { router.push("/listings/new"); }}
                            variant="primary"
                        />

                        <QuickActionTile
                            icon={MyListingsIcon}
                            label={t("home.myListings")}
                            onPress={() => { router.push({ pathname: "/listings", params: { tab: "my" } }); }}
                        />

                        <QuickActionTile
                            icon={ChatsIcon}
                            label={t("home.chats")}
                            onPress={() => { router.push("/chats"); }}
                        />

                        <QuickActionTile
                            icon={AccountIcon}
                            label={t("home.account")}
                            onPress={() => { router.push("/account"); }}
                        />
                    </View>

                    <View className="rounded-[10px] bg-accent p-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[20px] font-noto-bold text-black">{t("home.chats")}</Text>

                            <Pressable onPress={() => { router.push("/chats"); }}>
                                <Text className="font-noto-semibold text-[16px] text-forehued">{t("home.allChats")}</Text>
                            </Pressable>
                        </View>

                        {recentConversations.length === 0
                            ? <Text className="mt-3 font-noto text-sm text-muted-foreground">
                                {t("home.noConversations")}
                                </Text>

                            : <ScrollView
                                    className="mt-3"
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                >
                                <View className="flex-row gap-3">
                                        {recentConversations.map(({ counterpart }) => <Pressable
                                                key={counterpart.id}
                                                onPress={() => { router.push(`/chats/${counterpart.id}`); }}
                                            >
                                                <UserAvatar
                                                    avatar={counterpart.avatar}
                                                    firstname={counterpart.firstname}
                                                    id={counterpart.id}
                                                    surname={counterpart.surname}
                                                />
                                             </Pressable>,)}
                                    </View>
                              </ScrollView>}
                    </View>

                    <View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[20px] font-noto-bold text-black">{t("home.newListingsHeading")}</Text>

                            <Pressable onPress={() => { router.push("/listings"); }}>
                                <Text className="font-noto-semibold text-[16px] text-forehued">{t("home.allListings")}</Text>
                            </Pressable>
                        </View>

                        <View className="mt-2 flex-row flex-wrap">
                            {newListings.map(listing => <View className="w-1/2 p-1"
key={listing.id}>
                                    <ListingItem
                                        distanceLabel={currentUser == null ? undefined : formatDistanceLabel(t, currentUser, listing.user ?? {})}
                                        listing={listing}
                                        onPress={() => { router.push(`/listings/${listing.id}`); }}
                                    />
                                 </View>,)}

                            {newListings.length === 0 &&
                                <Text className="p-2 font-noto text-sm text-muted-foreground">
                                    {t("home.noListings")}
                                </Text>}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
