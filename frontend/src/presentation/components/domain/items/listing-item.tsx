import { Image, View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { MapPin, ImageOff } from "lucide-react-native";
import type { ApiListing } from "@/domain/entities";

export interface ListingItemProps {
    readonly listing: ApiListing,
}

export default function ListingItem({ listing }: ListingItemProps) {
    const coverUri = listing.attachments?.[0]?.path;
    const location = listing.user?.location;

    return (
        <View className="flex flex-col bg-accent rounded-md overflow-hidden">
            {coverUri != null
                ? (
                    <Image
                        className="w-full aspect-video"
                        source={{ uri: coverUri }}
                        resizeMode="cover"
                    />
                )
                : (
                    <View className="w-full aspect-video bg-muted items-center justify-center">
                        <Icon as={ImageOff} className="text-muted-foreground size-8" />
                    </View>
                )}

            <View className="flex flex-col gap-1 p-2">
                <Text
                    className="font-semibold"
                    ellipsizeMode="tail"
                    numberOfLines={2}
                >
                    {listing.title}
                </Text>

                {location != null && (
                    <View className="flex flex-row gap-1 items-center">
                        <Icon as={MapPin} className="text-muted-foreground size-3" />
                        <Text className="text-muted-foreground font-medium text-sm">
                            {location}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}
