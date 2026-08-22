import { Image, Pressable, View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Heart, MapPin, ImageOff } from "lucide-react-native";
import type { ApiListing } from "@/domain/entities";
import { useCreateFavorite, useDeleteFavorite, useGetFavorites } from "@/presentation/hooks";

export interface ListingItemProps {
    readonly listing: ApiListing;
    readonly onPress?: () => void;
    readonly distanceLabel?: string;
}

export default function ListingItem({ listing, onPress, distanceLabel }: ListingItemProps) {
    const coverUri = listing.attachments?.[0]?.path;
    const location = listing.user?.location;
    const { data: favorites } = useGetFavorites();
    const { mutate: createFavorite, isPending: isFavoriting } = useCreateFavorite();
    const { mutate: deleteFavorite, isPending: isUnfavoriting } = useDeleteFavorite();

    const favorite = favorites?.find(f => f.listingId === listing.id);
    const isFavorited = favorite != null;

    function toggleFavorite() {
        if (isFavoriting || isUnfavoriting) return;

        if (favorite != null) {
            deleteFavorite({ id: favorite.id });
        } else {
            createFavorite({ listingId: listing.id });
        }
    }

    return (
        <View className="flex flex-col overflow-hidden rounded-[10px]">
            <View className="relative">
                {/* Note: this is a *sibling* of the favorite button below, not a parent —
                    nesting a Pressable inside another Pressable's subtree causes the outer
                    one to swallow touches meant for the inner one on Android. */}
                <Pressable onPress={onPress}>
                    {coverUri != null
                        ? (
                            <Image
                                className="aspect-[6/5] w-full"
                                resizeMode="cover"
                                source={{ uri: coverUri }}
                            />
                        )
                        : (
                            <View className="aspect-[6/5] w-full items-center justify-center bg-muted">
                                <Icon as={ImageOff} className="size-8 text-muted-foreground" />
                            </View>
                        )}
                </Pressable>

                <Pressable
                    className="absolute right-[6px] top-[6px] size-[30px] items-center justify-center rounded-full bg-white/90"
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

                {location != null && (
                    <View className="flex flex-row items-center gap-1">
                        <Icon as={MapPin} className="size-4 text-forehued" />
                        <Text
                            className="font-noto-medium text-[14px] text-forehued"
                            ellipsizeMode="tail"
                            numberOfLines={1}
                        >
                            {location}
                        </Text>
                    </View>
                )}

                {distanceLabel != null && (
                    <Text className="font-noto-medium text-[14px] text-forehued">
                        {distanceLabel}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}
