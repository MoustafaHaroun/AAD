import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { View, Pressable, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search } from "lucide-react-native";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { CategoryFilterChips } from "@/presentation/components/domain/listings/category-filter-chips";
import { useCurrentUserId, useGetApiListings, useGetFavorites } from "@/presentation/hooks";
import type { ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

const TABS = [
    { key: "near", label: "Listings near you" },
    { key: "liked", label: "Liked listings" },
    { key: "my", label: "My listings" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 *
 */
export default function ListingsScreen(): React.JSX.Element {
    const router = useRouter();
    const params = useLocalSearchParams<{ q?: string, tab?: TabKey }>();
    const currentUserId = useCurrentUserId();
    const [tab, setTab] = useState<TabKey>(params.tab ?? "near");
    const [query, setQuery] = useState(params.q ?? "");
    const [category, setCategory] = useState<ListingCategory | undefined>(undefined);

    const { data, isFetching, isLoading, error, refetch } = useGetApiListings(
        tab === "near" ? { q: query || undefined, category } : {},
    );
    const { data: favorites } = useGetFavorites();

    const listings = useMemo(() => {
        if (data == null) { return undefined; }

        if (tab === "liked") {
            const favoriteListingIds = new Set(favorites?.map(f => f.listingId));

            return data.filter(listing => favoriteListingIds.has(listing.id));
        }

        if (tab === "my") {
            return data.filter(listing => listing.user?.id === currentUserId);
        }

        return data;
    }, [data, favorites, tab, currentUserId]);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView
                className="flex-1 bg-background"
                edges={["top"]}
            >
                <View className="bg-prim px-4 pb-4 pt-2">
                    <Text className="text-center text-[28px] font-noto-bold text-black">Trade²</Text>
                </View>

                <View className="gap-3 p-4">
                    <View className="flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                        <Icon
                            as={Search}
                            className="size-6 text-forehued"
                        />

                        <Input
                            className="h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                            onChangeText={setQuery}
                            placeholder="Search"
                            returnKeyType="search"
                            value={query}
                        />
                    </View>

                    <View className="flex-row gap-4 border-b border-border">
                        {TABS.map(t => (<Pressable
                                className={cn("pb-2", tab === t.key && "border-b-2 border-black")}
                                key={t.key}
                                onPress={() => { setTab(t.key); }}
                            >
                                <Text
                                    className={cn(
                                        "text-[15px]",
                                        tab === t.key ? "font-noto-bold text-black" : "font-noto-medium text-forehued",
                                    )}
                                >
                                    {t.label}
                                </Text>
                             </Pressable>),)}
                    </View>

                    {tab === "near" && <CategoryFilterChips
                        onChange={setCategory}
                        value={category}
                    />}
                </View>

                <ScrollView
                    contentContainerStyle={{ padding: 16, paddingTop: 0, flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refetch}
                            refreshing={isFetching && !isLoading}
                        />
                    }
                >
                    {isLoading
                        ? <View className="flex-1 items-center justify-center">
                                <ActivityIndicator />
                            </View>
                        : null}

                    {error != null &&
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-center text-sm text-destructive">{error.message}</Text>
                        </View>}

                    {listings?.length === 0 &&
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-muted-foreground">
                                {tab === "liked" && "You haven't liked any listings yet."}

                                {tab === "my" && "You haven't posted any listings yet."}

                                {tab === "near" && "No listings yet."}
                            </Text>
                        </View>}

                    <View className="-m-1 flex flex-row flex-wrap">
                        {listings?.map(listing => (<Pressable
                                className="w-1/2 p-1"
                                key={listing.id}
                                onPress={() => { router.push(`/listings/${listing.id}`); }}
                            >
                                <ListingItem listing={listing} />
                             </Pressable>),)}
                    </View>
                </ScrollView>

                <View className="absolute bottom-0 right-0 p-4">
                    <Pressable
                        className="h-14 w-14 items-center justify-center rounded-full bg-prim shadow-lg shadow-black"
                        onPress={() => { router.push("/listings/new"); }}
                    >
                        <Icon
                            as={Plus}
                            className="size-6 text-black"
                        />
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    );
}
