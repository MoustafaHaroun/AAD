import { View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { MapPin } from "lucide-react-native";
import type { Listing } from "@/domain/entities";

export interface ListingItemProps {
    readonly listing: Listing,
}

/**
 * Render the ListingItem component.
 * @param props.listing - The listing object.
 * @param root0
 * @param root0.listing
 * @returns The ListingItem component.
 */
export default function ListingItem({ listing }: ListingItemProps) {
    return (
        <View className="bg-accent rounded-md grow">
            <View className="flex flex-col grow gap-1 p-2">
                <View className="grow">
                    <Text
                        className="font-semibold"
                        ellipsizeMode="tail"
                        numberOfLines={2}
                    >
                        {listing.title}
                    </Text>
                </View>

                <View className="flex flex-row gap-1 items-center">
                    <Icon
                        as={MapPin}
                        className="text-muted-foreground size-3"
                    />

                    <Text className="text-muted-foreground font-medium text-sm">
                        {listing.location}
                    </Text>
                </View>
            </View>
        </View>
    );
}
