import * as React from "react";
import { Image, Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Heart, MapPin, ImageOff } from "lucide-react-native";
import type { ApiListing } from "@/domain/entities";
import { useCreateFavorite, useDeleteFavorite, useGetFavorites, useNetworkStatus } from "@/presentation/hooks";
import { cn } from "@/presentation/utils/cn.util";

export interface ListingItemProps {
    readonly listing: ApiListing,
    readonly onPress?: () => void,
    readonly distanceLabel?: string,
}

/**
 * Render a listing's cover photo, or a placeholder icon when it has none.
 * @param props - The props.
 * @param props.uri - The cover attachment's URI, if the listing has one.
 * @returns The rendered cover.
 */
function ListingCover({ uri }: { readonly uri?: string }): React.JSX.Element {
    if (uri == null) {
        return (
            <View className="aspect-[6/5] w-full items-center justify-center bg-muted">
                <Icon
                    as={ImageOff}
                    className="size-8 text-muted-foreground"
                />
            </View>
        );
    }

    return (
        <Image
            className="aspect-[6/5] w-full"
            resizeMode="cover"
            source={{ uri }}
        />
    );
}

/**
 * Render a listing card with cover image, favorite toggle, title, and location.
 * @param props - The props.
 * @param props.listing - The listing to display.
 * @param props.onPress - Called when the card is pressed.
 * @param props.distanceLabel - A precomputed "N km away" label, if the viewer's location is known.
 * @returns The rendered card.
 */
export default function ListingItem({ listing, onPress, distanceLabel }: ListingItemProps): React.JSX.Element {
    const { t } = useTranslation();
    const coverUri = listing.attachments?.[0]?.path;
    const location = listing.user?.location;
    const { data: favorites } = useGetFavorites();
    const { mutate: createFavorite, isPending: isFavoriting } = useCreateFavorite();
    const { mutate: deleteFavorite, isPending: isUnfavoriting } = useDeleteFavorite();
    const isOnline = useNetworkStatus();

    const favorite = favorites?.find(f => f.listingId === listing.id);
    const isFavorited = favorite != null;

    /**
     * Create or delete the favorite for this listing, based on its current state.
     */
    function toggleFavorite(): void {
        if (isFavoriting || isUnfavoriting || !isOnline) {
            return;
        }

        if (favorite == null) {
            createFavorite({ listingId: listing.id });
        } else {
            deleteFavorite({ id: favorite.id });
        }
    }

    return (
        <View className="flex flex-col overflow-hidden rounded-[10px]">
            <View className="relative">
                {/* Note: this is a *sibling* of the favorite button below, not a parent —
                    nesting a Pressable inside another Pressable's subtree causes the outer
                    one to swallow touches meant for the inner one on Android. */}
                <Pressable
                    accessibilityLabel={listing.title}
                    accessibilityRole="button"
                    onPress={onPress}
                >
                    <ListingCover uri={coverUri} />
                </Pressable>

                <Pressable
                    accessibilityLabel={isFavorited ? t("common.unfavorite") : t("common.favorite")}
                    accessibilityRole="button"
                    className={cn(
                        "absolute right-[6px] top-[6px] size-[30px] items-center justify-center rounded-full bg-white/90",
                        !isOnline && "opacity-50",
                    )}
                    disabled={!isOnline}
                    hitSlop={8}
                    onPress={toggleFavorite}
                >
                    <Icon
                        as={Heart}
                        className={isFavorited ? "size-4 text-forehued fill-forehued" : "size-4 text-forehued"}
                    />
                </Pressable>
            </View>

            <Pressable
                accessibilityLabel={listing.title}
                accessibilityRole="button"
                className="flex flex-col gap-1 rounded-b-[10px] bg-surfhued p-2"
                onPress={onPress}
            >
                <View className="h-10 justify-center">
                    <Text
                        className="font-noto-semibold text-[16px] text-black"
                        ellipsizeMode="tail"
                        numberOfLines={2}
                    >
                        {listing.title}
                    </Text>
                </View>

                {location != null &&
                    <View className="flex flex-row items-center gap-1">
                        <Icon
                            as={MapPin}
                            className="size-4 text-forehued"
                        />

                        <Text
                            className="font-noto-medium text-[14px] text-forehued"
                            ellipsizeMode="tail"
                            numberOfLines={1}
                        >
                            {location}
                        </Text>
                    </View>}

                {distanceLabel != null &&
                    <Text className="font-noto-medium text-[14px] text-forehued">
                        {distanceLabel}
                    </Text>}
            </Pressable>
        </View>
    );
}
