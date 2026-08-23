import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { useMemo, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import ListingItem from "@/presentation/components/domain/items/listing-item";
import {
    type TabKey,
    filterListings,
    ListingsFiltersBar,
    ListingsStatusOverlay,
    ListingsEmptyState,
    NewListingFab,
} from "@/presentation/components/domain/listings/listings-screen-parts";
import { useCurrentUserId, useGetApiListings, useGetFavorites, useGetUser, useNetworkStatus } from "@/presentation/hooks";
import { OfflineBanner } from "@/presentation/components/containers/offline-banner";
import type { ListingCategory } from "@/domain/entities/listing-category.entity";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";

/**
 * Render the browsable listings grid with tabs, search, and category filtering.
 * @returns The rendered listings screen.
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
    // And filter client-side below. Server-side filtering would mean every
    // Distinct search/category combination is its own network-only query
    // With nothing to fall back on offline.
    const { data, isFetching, isLoading, error, refetch } = useGetApiListings();
    const { data: favorites } = useGetFavorites();
    const { data: currentUser } = useGetUser(currentUserId ?? "");
    const isOnline = useNetworkStatus();

    const listings = useMemo(
        () => filterListings(data, tab, { favorites, currentUserId }, query, category),
        [data, favorites, tab, currentUserId, query, category],
    );

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

                <ListingsFiltersBar
                    category={category}
                    onChangeCategory={setCategory}
                    onChangeQuery={setQuery}
                    onChangeTab={setTab}
                    query={query}
                    tab={tab}
                />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 16, paddingTop: 0, flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => { void refetch(); }}
                            refreshing={isFetching ? !isLoading : false}
                        />
                    }
                >
                    <ListingsStatusOverlay
                        hasError={error != null && data == null}
                        isLoading={isLoading}
                        isOnline={isOnline}
                    />

                    <ListingsEmptyState
                        show={listings?.length === 0}
                        tab={tab}
                    />

                    <View className="-m-1 flex flex-row flex-wrap">
                        {listings?.map(listing => <View
                            className="w-1/2 p-1"
                            key={listing.id}>
                            <ListingItem
                                distanceLabel={currentUser == null ? undefined : formatDistanceLabel(t, currentUser, listing.user ?? {})}
                                listing={listing}
                                onPress={() => { router.push(`/listings/${listing.id}`); }}
                            />
                        </View>)}
                    </View>
                </ScrollView>

                <NewListingFab
                    isOnline={isOnline}
                    onPress={() => { router.push("/listings/new"); }}
                />
            </View>
        </>
    );
}
