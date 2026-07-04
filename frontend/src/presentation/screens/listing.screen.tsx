import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { MapPin, Pencil, Trash, EllipsisVertical, Heart, ImageOff } from "lucide-react-native";
import { useGetApiListing, useDeleteApiListing, useCreateFavorite, useDeleteFavorite, useCreateMessage } from "@/presentation/hooks";
import { SwipableImageGallery } from "@/presentation/components/primitives/custom";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";

export default function ListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: listing } = useGetApiListing(id);
    const { mutate: mutateDeleteListing } = useDeleteApiListing();
    const { mutate: createFavorite } = useCreateFavorite();
    const { mutate: deleteFavoriteItem } = useDeleteFavorite();
    const { mutate: sendMessage } = useCreateMessage();

    const [favoriteId, setFavoriteId] = useState<string | null>(null);
    const isFavorited = favoriteId != null;

    function deleteListing(): void {
        if (listing != null) {
            mutateDeleteListing({ id: listing.id }, { onSuccess: () => router.back() });
        }
    }

    function toggleFavorite(): void {
        if (isFavorited) {
            deleteFavoriteItem({ id: favoriteId! }, { onSuccess: () => setFavoriteId(null) });
        } else {
            createFavorite(
                { listingId: listing!.id },
                { onSuccess: (data) => setFavoriteId(data.id) },
            );
        }
    }

    function onSendMessage(): void {
        if (listing?.user == null) return;
        sendMessage(
            { content: `Hi, I'm interested in your listing "${listing.title}".`, recipientId: listing.user.id },
        );
    }

    const attachmentPaths = listing?.attachments?.map(a => a.path) ?? [];

    return (
        <>
            <Stack.Screen options={{
                ...SCREEN_OPTIONS,
                headerRight: () => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Pressable className="flex items-center justify-center w-8 aspect-square">
                                <Icon className="size-5" as={EllipsisVertical} />
                            </Pressable>
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                            <View className="flex flex-col gap-1">
                                <PopoverClose
                                    className="flex flex-row items-center gap-2 py-2 px-2"
                                    onPress={() => router.push(`/listings/${id}/edit`)}
                                >
                                    <Icon className="size-4" as={Pencil} />
                                    <Text className="text-sm font-medium">Edit</Text>
                                </PopoverClose>

                                <PopoverClose>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <View className="flex flex-row items-center gap-2 py-2 px-2">
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
                ),
            }} />

            <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
                <ScrollView className="flex-1" bounces>

                    {/* Gallery */}
                    {attachmentPaths.length > 0
                        ? <SwipableImageGallery uris={attachmentPaths} />
                        : (
                            <View className="w-full aspect-video bg-muted items-center justify-center">
                                <Icon as={ImageOff} className="text-muted-foreground size-12" />
                            </View>
                        )}

                    {listing != null && (
                        <View className="flex flex-col gap-4 p-4">

                            {/* User info */}
                            <View className="flex flex-col gap-1">
                                <Text className="text-2xl font-bold">
                                    {listing.user?.firstname} {listing.user?.surname}
                                </Text>
                                {listing.user?.location != null && (
                                    <View className="flex flex-row items-center gap-1">
                                        <Icon as={MapPin} className="text-muted-foreground size-4" />
                                        <Text className="text-sm text-muted-foreground">
                                            {listing.user.location}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Separator />

                            {/* Title + Favorite */}
                            <View className="flex flex-row items-start justify-between gap-4">
                                <Text className="text-lg font-bold flex-1">{listing.title}</Text>

                                <Pressable
                                    onPress={toggleFavorite}
                                    className="w-12 h-12 rounded-full bg-primary items-center justify-center shrink-0"
                                >
                                    <Icon
                                        as={Heart}
                                        className={isFavorited ? "text-white size-5 fill-white" : "text-foreground size-5"}
                                    />
                                </Pressable>
                            </View>

                            {/* Description */}
                            {listing.description != null && (
                                <Text className="text-sm leading-relaxed text-foreground">
                                    {listing.description}
                                </Text>
                            )}
                        </View>
                    )}
                </ScrollView>

                {/* Fixed bottom CTA */}
                <View className="px-4 pt-3 pb-4 bg-background border-t border-border">
                    <Button
                        className="rounded-full h-14"
                        onPress={onSendMessage}
                        disabled={listing == null}
                    >
                        <Text className="font-semibold text-base">Send message</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </>
    );
}
