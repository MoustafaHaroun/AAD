import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {Image, Pressable, View} from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import {Pencil, MapPin, Trash, EllipsisVertical, Share2} from "lucide-react-native";
import { useGetListingById } from "@/presentation/hooks";
import { useDeleteListing } from "@/presentation/hooks/mutations/delete-listing.hook";
import {SwipableImageGallery} from "@/presentation/components/primitives/custom";
import {Separator} from "@/presentation/components/primitives/rnreusables";

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
     * Delete the listing.
     */
    function deleteListing(): void {
        if (listing != null) {
            mutateDeleteListing({ listing });
        }
    }

    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, headerRight: () => (
                <View className="flex flex-row">
                    <Pressable className="w-8 aspect-square">
                        <Icon className="size-4" as={Share2} />
                    </Pressable>

                    <Pressable className="w-8 aspect-square">
                        <Icon className="size-4" as={EllipsisVertical} />
                    </Pressable>
                </View>
            ) }} />

            <View className="flex flex-col h-full">
                {listing != null
                    ? <View>
                        <SwipableImageGallery uris={listing.attachments} />

                        <View className="flex flex-col gap-4 p-4">
                            <View className="flex flex-col">
                                <Text className="font-semibold">{listing.user}</Text>

                                <View className="flex flex-row gap-1 items-center">
                                    <Icon className="text-muted-foreground" as={MapPin} />

                                    <Text className="text-sm text-muted-foreground">{listing.location}</Text>
                                </View>
                            </View>

                            <Separator />

                            <View className="flex flex-col gap-1">
                                <Text className="font-bold text-xl">{listing.title}</Text>
                                <Text className="text-sm">{listing.description}</Text>
                            </View>
                        </View>

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
