import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { View, Pressable, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import { CategoryFilterChips } from "@/presentation/components/domain/listings/category-filter-chips";
import { useCurrentUserId, useGetApiListings, useGetFavorites, useGetUser, useNetworkStatus } from "@/presentation/hooks";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";
import type { ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";

const TABS = [
    { key: "near" },
    { key: "liked" },
    { key: "my" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 *
 */
export default function ListingsScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ q?: string, tab?: TabKey }>();
    const currentUserId = useCurrentUserId();
    const [tab, setTab] = useState<TabKey>(params.tab ?? "near");
    const [query, setQuery] = useState(params.q ?? "");
    const [category, setCategory] = useState<ListingCategory | undefined>(undefined);

    // Always fetch the same unfiltered list — a single stable cache entry —
    // and filter client-side below. Server-side filtering would mean every
    // distinct search/category combination is its own network-only query
    // with nothing to fall back on offline.
    const { data, isFetching, isLoading, error, refetch } = useGetApiListings();
    const { data: favorites } = useGetFavorites();
    const { data: currentUser } = useGetUser(currentUserId ?? "");
    const isOnline = useNetworkStatus();

    const listings = useMemo(() => {
        if (data == null) { return undefined; }

        if (tab === "liked") {
            const favoriteListingIds = new Set(favorites?.map(f => f.listingId));

            return data.filter(listing => favoriteListingIds.has(listing.id));
        }

        if (tab === "my") {
            return data.filter(listing => listing.user?.id === currentUserId);
        }

        const normalizedQuery = query.trim().toLowerCase();

        return data.filter(listing => {
            const matchesQuery = normalizedQuery.length === 0
                || listing.title.toLowerCase().includes(normalizedQuery)
                || (listing.description?.toLowerCase().includes(normalizedQuery) ?? false);
            const matchesCategory = category == null || listing.category === category;

            return matchesQuery && matchesCategory;
        });
    }, [data, favorites, tab, currentUserId, query, category]);

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

                <View className="gap-3 p-4">
                    <View className="flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                        <Icon
                            as={Search}
                            className="size-6 text-forehued"
                        />

                        <Input
                            className="h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                            onChangeText={setQuery}
                            placeholder={t("common.search")}
                            returnKeyType="search"
                            value={query}
                        />
                    </View>

                    <ScrollView
                        className="border-b border-border"
                        contentContainerStyle={{ gap: 16 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {TABS.map(tabItem => (<Pressable
                                className={cn("pb-2", tab === tabItem.key && "border-b-2 border-black")}
                                key={tabItem.key}
                                onPress={() => { setTab(tabItem.key); }}
                            >
                                <Text
                                    className={cn(
                                        "text-[15px]",
                                        tab === tabItem.key ? "font-noto-bold text-black" : "font-noto-medium text-forehued",
                                    )}
                                    numberOfLines={1}
                                >
                                    {t(`listings.tabs.${tabItem.key}`)}
                                </Text>
                             </Pressable>),)}
                    </ScrollView>

                    {tab === "near" && <CategoryFilterChips
                        onChange={setCategory}
                        value={category}
                    />}
                </View>

                <ScrollView
                    className="flex-1"
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

                    {error != null && data == null &&
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-center text-sm text-destructive">
                                {isOnline ? t("common.loadError") : t("common.notAvailableOffline")}
                            </Text>
                        </View>}

                    {listings?.length === 0 &&
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-muted-foreground">
                                {tab === "liked" && t("listings.emptyLiked")}

                                {tab === "my" && t("listings.emptyMy")}

                                {tab === "near" && t("listings.emptyNear")}
                            </Text>
                        </View>}

                    <View className="-m-1 flex flex-row flex-wrap">
                        {listings?.map(listing => (
                            <View className="w-1/2 p-1" key={listing.id}>
                                <ListingItem
                                    distanceLabel={currentUser == null ? undefined : formatDistanceLabel(t, currentUser, listing.user ?? {})}
                                    listing={listing}
                                    onPress={() => { router.push(`/listings/${listing.id}`); }}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>

                <View className="absolute bottom-0 right-0 p-4">
                    <Pressable
                        accessibilityLabel={t("home.newListing")}
                        accessibilityRole="button"
                        className={cn("h-14 w-14 items-center justify-center rounded-full bg-prim shadow-lg shadow-black", !isOnline && "opacity-50")}
                        disabled={!isOnline}
                        onPress={() => { router.push("/listings/new"); }}
                    >
                        <Icon
                            as={Plus}
                            className="size-6 text-black"
                        />
                    </Pressable>
                </View>
            </View>
        </>
    );
}
