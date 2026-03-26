import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import {
    Text,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    AlertDialogTrigger,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    Separator,
    PopoverClose,
} from "@/presentation/components/primitives/rnreusables";
import { Pencil, MapPin, Trash, EllipsisVertical, Share2 } from "lucide-react-native";
import { useGetListingById } from "@/presentation/hooks";
import { useDeleteListing } from "@/presentation/hooks/mutations/delete-listing.hook";
import { SwipableImageGallery } from "@/presentation/components/primitives/custom";
import { useSharingService } from "@/presentation/hooks/services/sharing-service.hook";

/**
 * Render the ListingScreen component.
 * @returns The ListingScreen component.
 */
export default function ListingScreen(): React.JSX.Element {
    const router = useRouter();
    const sharing = useSharingService();
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

    /**
     * Share the listing.
     */
    async function shareListing(): Promise<void> {
        if (listing != null) {
            await sharing.shareListing(listing);
        }
    }

    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, headerRight: () => (
                <View className="flex flex-row items-center justify-center gap-2">
                    <Pressable className="flex items-center justify-center w-8 aspect-square" onPress={shareListing}>
                        <Icon className="size-5" as={Share2} />
                    </Pressable>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Pressable className="flex items-center justify-center w-8 aspect-square">
                                <Icon className="size-5" as={EllipsisVertical} />
                            </Pressable>
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                            <View className="flex flex-col grow gap-1">
                                <PopoverClose className="flex flex-row items-center gap-1 py-1 px-2" onPress={() => router.push(`/listings/${id}/edit`)}>
                                    <Icon className="size-4" as={Pencil} />
                                    <Text className="text-sm font-medium">Edit</Text>
                                </PopoverClose>

                                <PopoverClose>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <View className="flex flex-row items-center gap-1 py-1 px-2">
                                                <Icon className="size-4" as={Trash} />
                                                <Text className="text-sm font-medium">Delete</Text>
                                            </View>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. Are you sure you wish to permanently delete your listing?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    <Text>Cancel</Text>
                                                </AlertDialogCancel>
                                                <AlertDialogAction onPress={deleteListing}>
                                                    <Text>Delete</Text>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </PopoverClose>
                            </View>
                        </PopoverContent>
                    </Popover>
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
            </View>
        </>
    );
}
