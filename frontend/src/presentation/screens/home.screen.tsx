import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList, MessageSquare, Plus, Search, User } from "lucide-react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { QuickActionTile } from "@/presentation/components/domain/home/quick-action-tile";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import { useConversations, useGetApiListings } from "@/presentation/hooks";

const CHATS_PREVIEW_LIMIT = 5;

const NEW_LISTINGS_LIMIT = 4;

/**
 *
 */
export default function HomeScreen(): React.JSX.Element {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const { data: listings } = useGetApiListings();
    const { conversations } = useConversations();
    const newListings = listings?.slice(0, NEW_LISTINGS_LIMIT) ?? [];
    const recentConversations = conversations?.slice(0, CHATS_PREVIEW_LIMIT) ?? [];

    /**
     *
     */
    function onSearchSubmit() {
        router.push(query.trim().length > 0 ? { pathname: "/listings", params: { q: query.trim() } } : "/listings");
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView
                className="flex-1 bg-background"
                edges={["top"]}
            >
                <View className="bg-prim px-4 pb-4 pt-2">
                    <Text className="text-center text-[28px] font-noto-bold text-black">Trade²</Text>

                    <View className="mt-4 flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                        <Icon
                            as={Search}
                            className="size-6 text-forehued"
                        />

                        <Input
                            className="h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                            onChangeText={setQuery}
                            onSubmitEditing={onSearchSubmit}
                            placeholder="Search"
                            returnKeyType="search"
                            value={query}
                        />
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, gap: 16 }}
                >
                    <View className="flex-row gap-2">
                        <QuickActionTile
                            icon={Plus}
                            label="New listing"
                            onPress={() => { router.push("/listings/new"); }}
                            variant="primary"
                        />

                        <QuickActionTile
                            icon={ClipboardList}
                            label="My listings"
                            onPress={() => { router.push("/listings"); }}
                        />

                        <QuickActionTile
                            icon={MessageSquare}
                            label="Chats"
                            onPress={() => { router.push("/chats"); }}
                        />

                        <QuickActionTile
                            icon={User}
                            label="Account"
                            onPress={() => { router.push("/account"); }}
                        />
                    </View>

                    <View className="rounded-[10px] bg-accent p-4">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[20px] font-noto-bold text-black">Chats</Text>

                            <Pressable onPress={() => { router.push("/chats"); }}>
                                <Text className="font-noto-semibold text-[16px] text-forehued">All Chats</Text>
                            </Pressable>
                        </View>

                        {recentConversations.length === 0
                            ? <Text className="mt-3 font-noto text-sm text-muted-foreground">
                                No conversations yet.
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
                            <Text className="text-[20px] font-noto-bold text-black">New Listings</Text>

                            <Pressable onPress={() => { router.push("/listings"); }}>
                                <Text className="font-noto-semibold text-[16px] text-forehued">All Listings</Text>
                            </Pressable>
                        </View>

                        <View className="mt-2 flex-row flex-wrap">
                            {newListings.map(listing => (<Pressable
                                    className="w-1/2 p-1"
                                    key={listing.id}
                                    onPress={() => { router.push(`/listings/${listing.id}`); }}
                                >
                                    <ListingItem listing={listing} />
                                 </Pressable>),)}

                            {newListings.length === 0 &&
                                <Text className="p-2 font-noto text-sm text-muted-foreground">
                                    No listings yet.
                                </Text>}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
