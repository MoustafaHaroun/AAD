import * as React from "react";
import { View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Plus, Search } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { CategoryFilterChips } from "@/presentation/components/domain/listings/category-filter-chips";
import type { ApiListing } from "@/domain/entities";
import type { Favorite } from "@/domain/entities/favorite.entity";
import type { ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

export const TABS = [
    { key: "near" },
    { key: "liked" },
    { key: "my" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

interface ListingsFilterViewer {
    readonly favorites: Favorite[] | undefined,
    readonly currentUserId: string | null,
}

/**
 * Filter the full listings list for the active tab (nearby/liked/mine), search query, and category.
 * @param data - The full, unfiltered listings list.
 * @param tab - The active tab.
 * @param viewer - The viewer's favorites and user id, used by the "liked"/"my" tabs.
 * @param query - The search query, used by the "near" tab.
 * @param category - The selected category filter, used by the "near" tab.
 * @returns The filtered listings.
 */
export function filterListings(
    data: ApiListing[] | undefined,
    tab: TabKey,
    viewer: ListingsFilterViewer,
    query: string,
    category: ListingCategory | undefined,
): ApiListing[] | undefined {
    if (data == null) {
        return undefined;
    }

    if (tab === "liked") {
        const favoriteListingIds = new Set(viewer.favorites?.map(f => f.listingId));

        return data.filter(listing => favoriteListingIds.has(listing.id));
    }

    if (tab === "my") {
        return data.filter(listing => listing.user?.id === viewer.currentUserId);
    }

    const normalizedQuery = query.trim().toLowerCase();

    return data.filter(listing => matchesListingFilters(listing, normalizedQuery, category));
}

/**
 * Check whether a listing matches the "near" tab's search query and category filter.
 * @param listing - The listing to check.
 * @param normalizedQuery - The lowercased, trimmed search query.
 * @param category - The selected category filter.
 * @returns Whether the listing matches both filters.
 */
function matchesListingFilters(listing: ApiListing, normalizedQuery: string, category: ListingCategory | undefined): boolean {
    const matchesQuery = normalizedQuery.length === 0 ||
        listing.title.toLowerCase().includes(normalizedQuery) ||
        (listing.description?.toLowerCase().includes(normalizedQuery) ?? false);
    const matchesCategory = category == null || listing.category === category;

    return matchesQuery && matchesCategory;
}

interface ListingsFiltersBarProps {
    readonly query: string,
    readonly onChangeQuery: (query: string) => void,
    readonly tab: TabKey,
    readonly onChangeTab: (tab: TabKey) => void,
    readonly category: ListingCategory | undefined,
    readonly onChangeCategory: (category: ListingCategory | undefined) => void,
}

/**
 * Render the listings screen's search input, tab bar, and (on the "near" tab) category chips.
 * @param props - The props.
 * @param props.query - The current search query.
 * @param props.onChangeQuery - Called as the search query changes.
 * @param props.tab - The active tab.
 * @param props.onChangeTab - Called when a tab is selected.
 * @param props.category - The selected category filter.
 * @param props.onChangeCategory - Called when the category filter changes.
 * @returns The rendered filters bar.
 */
export function ListingsFiltersBar({ query, onChangeQuery, tab, onChangeTab, category, onChangeCategory }: ListingsFiltersBarProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="gap-3 p-4">
            <View className="flex-row items-center gap-[10px] rounded-[10px] border-[1.5px] border-forehued bg-white px-[16px] py-[13px]">
                <Icon
                    as={Search}
                    className="size-6 text-forehued"
                />

                <Input
                    className="min-h-6 flex-1 border-0 bg-transparent p-0 font-noto-medium text-[16px] text-forehued"
                    onChangeText={onChangeQuery}
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
                {TABS.map(tabItem => <Pressable
                    className={cn("pb-2", tab === tabItem.key && "border-b-2 border-black")}
                    key={tabItem.key}
                    onPress={() => { onChangeTab(tabItem.key); }}
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
                </Pressable>)}
            </ScrollView>

            {tab === "near"
                ? <CategoryFilterChips
                        onChange={onChangeCategory}
                        value={category}
                    />
                : null}
        </View>
    );
}

interface ListingsStatusOverlayProps {
    readonly isLoading: boolean,
    readonly hasError: boolean,
    readonly isOnline: boolean,
}

/**
 * Render the listings screen's loading spinner or load-error message.
 * @param props - The props.
 * @param props.isLoading - Whether the listings are still loading for the first time.
 * @param props.hasError - Whether loading failed and no cached copy exists.
 * @param props.isOnline - Whether the device has a network connection.
 * @returns The rendered status block, or null once loaded.
 */
export function ListingsStatusOverlay({ isLoading, hasError, isOnline }: ListingsStatusOverlayProps): React.JSX.Element | null {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (hasError) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-center text-sm text-destructive">
                    {isOnline ? t("common.loadError") : t("common.notAvailableOffline")}
                </Text>
            </View>
        );
    }

    return null;
}

const EMPTY_MESSAGE_KEYS: Record<TabKey, string> = {
    near: "listings.emptyNear",
    liked: "listings.emptyLiked",
    my: "listings.emptyMy",
};

interface ListingsEmptyStateProps {
    readonly show: boolean,
    readonly tab: TabKey,
}

/**
 * Render the listings screen's "no results" message for the active tab.
 * @param props - The props.
 * @param props.show - Whether the empty state should be shown.
 * @param props.tab - The active tab, which determines the message shown.
 * @returns The rendered empty state, or null.
 */
export function ListingsEmptyState({ show, tab }: ListingsEmptyStateProps): React.JSX.Element | null {
    const { t } = useTranslation();

    if (!show) {
        return null;
    }

    return (
        <View className="flex-1 items-center justify-center py-8">
            <Text className="text-muted-foreground">
                {t(EMPTY_MESSAGE_KEYS[tab])}
            </Text>
        </View>
    );
}

interface NewListingFabProps {
    readonly isOnline: boolean,
    readonly onPress: () => void,
}

/**
 * Render the listings screen's floating "new listing" button.
 * @param props - The props.
 * @param props.isOnline - Whether the device has a network connection.
 * @param props.onPress - Called when the button is pressed.
 * @returns The rendered button.
 */
export function NewListingFab({ isOnline, onPress }: NewListingFabProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="absolute bottom-0 right-0 p-4">
            <Pressable
                accessibilityLabel={t("home.newListing")}
                accessibilityRole="button"
                className={cn("h-14 w-14 items-center justify-center rounded-full bg-prim shadow-lg shadow-black", !isOnline && "opacity-50")}
                disabled={!isOnline}
                onPress={onPress}
            >
                <Icon
                    as={Plus}
                    className="size-6 text-black"
                />
            </Pressable>
        </View>
    );
}
