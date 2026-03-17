import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Pencil, MapPin, Trash } from "lucide-react-native";
import { useGetListingById } from "@/presentation/hooks";
import { useDeleteListing } from "@/presentation/hooks/mutations/delete-listing.hook";

/**
 * Render the ListingScreen component.
 * @returns The ListingScreen component.
 */
export default function ListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { mutate: mutateDeleteListing } = useDeleteListing();
    const { data: listing } = useGetListingById(id);

    /**
     *
     */
    function deleteListing(): void {
        if (listing != null) {
            mutateDeleteListing({ listing });
        }
    }

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />

            <View className="flex flex-col p-4 h-full">
                {listing
                    ? <View>
                            <View className="flex flex-col">
                            <Text className="text-xl font-bold">{listing.user}</Text>

                            <View className="flex flex-row gap-1 items-center">
                                    <Icon as={MapPin} />

                                    <Text>{listing.location}</Text>
                                </View>
                        </View>

                            <Text>{listing.title}</Text>
                        </View>
                    : null}

                <View className="absolute p-4 bottom-0 right-0">
                    <Button
                        className="shadow-lg! shadow-black h-12 w-12"
                        onPress={deleteListing}
                    >
                        <Icon
                            as={Trash}
                            className="text-primary-foreground size-5"
                        />
                    </Button>

                    <Button className="shadow-lg! shadow-black h-12 w-12">
                        <Icon
                            as={Pencil}
                            className="text-primary-foreground size-5"
                        />
                    </Button>
                </View>
            </View>
        </>
    );
}
