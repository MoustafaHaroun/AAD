import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { useTranslation } from "react-i18next";
import {
    useGetApiListing,
    useDeleteApiListing,
    useCreateFavorite,
    useDeleteFavorite,
    useGetFavorites,
    useCreateMessage,
    useCurrentUserId,
    useCurrentUser,
    useGetUser,
} from "@/presentation/hooks";
import { SwipableImageGallery } from "@/presentation/components/primitives/custom";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";

/**
 *
 */
export default function ListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: listing } = useGetApiListing(id);
    const { mutate: mutateDeleteListing } = useDeleteApiListing();
    const { data: favorites } = useGetFavorites();
    const { mutate: createFavorite, isPending: isFavoriting } = useCreateFavorite();
    const { mutate: deleteFavoriteItem, isPending: isUnfavoriting } = useDeleteFavorite();
    const { mutate: sendMessage } = useCreateMessage();
    const currentUserId = useCurrentUserId();
    const currentUser = useCurrentUser();
    const { data: viewer } = useGetUser(currentUserId ?? "");

    const favorite = favorites?.find(f => f.listingId === id);
    const isFavorited = favorite != null;
    const canManage = listing != null
        && (listing.user?.id === currentUserId || currentUser?.role === "admin");
    const distanceLabel = viewer == null ? undefined : formatDistanceLabel(t, viewer, listing?.user ?? {});

    /**
     *
     */
    function deleteListing(): void {
        if (listing != null) {
            mutateDeleteListing({ id: listing.id }, { onSuccess: () => { router.back(); } });
        }
    }

    /**
     *
     */
    function toggleFavorite(): void {
        if (isFavoriting || isUnfavoriting || listing == null) { return; }

        if (favorite != null) {
            deleteFavoriteItem({ id: favorite.id });
        } else {
            createFavorite({ listingId: listing.id });
        }
    }

    /**
     *
     */
    function onTradeRequest(): void {
        if (listing?.user == null) { return; }
        const posterId = listing.user.id;

        sendMessage(
            { content: t("listing.tradeRequestMessage", { title: listing.title }), recipientId: posterId },
            { onSuccess: () => { router.push(`/chats/${posterId}`); } },
        );
    }

    const attachmentPaths = listing?.attachments?.map(a => a.path) ?? [];

    return (
        <>
            <Stack.Screen options={{
                ...SCREEN_OPTIONS,
                headerRight: !canManage ? undefined : () => (<Popover>
                        <PopoverTrigger asChild>
                            <Pressable className="flex items-center justify-center w-8 aspect-square">
                                <Icon className="size-5"
as={EllipsisVertical} />
                            </Pressable>
                        </PopoverTrigger>

                        <PopoverContent className="w-40">
                            <View className="flex flex-col gap-1">
                                <PopoverClose
                                    className="flex flex-row items-center gap-2 py-2 px-2"
                                    onPress={() => { router.push(`/listings/${id}/edit`); }}
                                >
                                    <Icon className="size-4"
as={Pencil} />

                                    <Text className="text-sm font-medium">{t("common.edit")}</Text>
                                </PopoverClose>

                                <PopoverClose>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <View className="flex flex-row items-center gap-2 py-2 px-2">
                                                <Icon className="size-4"
as={Trash} />

                                                <Text className="text-sm font-medium">{t("common.delete")}</Text>
                                            </View>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t("listing.deleteTitle")}</AlertDialogTitle>

                                                <AlertDialogDescription>
                                                    {t("listing.deleteDescription")}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    <Text>{t("common.cancel")}</Text>
                                                </AlertDialogCancel>

                                                <AlertDialogAction onPress={deleteListing}>
                                                    <Text>{t("common.delete")}</Text>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </PopoverClose>
                            </View>
                        </PopoverContent>
                     </Popover>),
            }}
            />

            <SafeAreaView
                className="flex-1 bg-background"
                edges={["bottom"]}
            >
                <ScrollView
                    bounces
                    className="flex-1"
                >

                    {/* Gallery */}
                    {attachmentPaths.length > 0
                        ? <SwipableImageGallery uris={attachmentPaths} />
                        : <View className="w-full aspect-video items-center justify-center bg-muted">
                            <Icon
                                    as={ImageOff}
                                    className="size-12 text-muted-foreground"
                                />
                          </View>}

                    {listing != null &&
                        <View className="flex flex-col gap-4 p-4">

                            {/* User info */}
                            <View className="flex flex-col gap-1">
                                <Text className="text-[28px] font-noto-bold text-black">
                                    {listing.user?.firstname} {listing.user?.surname}
                                </Text>

                                {listing.user?.location != null &&
                                    <View className="flex flex-row items-center gap-1">
                                        <Icon
                                            as={MapPin}
                                            className="size-4 text-forehued"
                                        />

                                        <Text className="font-noto-semibold text-[16px] text-forehued">
                                            {listing.user.location}
                                        </Text>
                                    </View>}

                                {distanceLabel != null &&
                                    <Text className="font-noto-medium text-[14px] text-forehued">
                                        {distanceLabel}
                                    </Text>}
                            </View>

                            <Separator />

                            {/* Title + Favorite */}
                            <View className="flex flex-row items-start justify-between gap-4">
                                <Text className="flex-1 text-[24px] font-noto-bold text-black">{listing.title}</Text>

                                <Pressable
                                    className="size-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                                    onPress={toggleFavorite}
                                >
                                    {isFavorited
                                        ? <LinearGradient
                                                colors={["#FCC010", "#F28D1B"]}
                                                end={{ x: 1, y: 1 }}
                                                start={{ x: 0, y: 0 }}
                                                style={{ alignItems: "center", height: "100%", justifyContent: "center", width: "100%" }}
                                          >
                                                <Icon
                                                as={Heart}
                                                className="size-5 fill-black text-black"
                                            />
                                            </LinearGradient>

                                        : <View className="size-full items-center justify-center bg-surfhued">
                                                <Icon
                                                as={Heart}
                                                className="size-5 text-forehued"
                                            />
                                            </View>}
                                </Pressable>
                            </View>

                            {/* Description */}
                            {listing.description != null &&
                                <Text className="font-noto text-[16px] leading-relaxed text-black">
                                    {listing.description}
                                </Text>}
                        </View>}
                </ScrollView>

                {/* Fixed bottom CTA */}
                {listing != null && listing.user?.id !== currentUserId &&
                    <View className="border-t border-border bg-background px-4 pb-4 pt-3">
                        <GradientButton onPress={onTradeRequest}>
                            {t("listing.tradeRequest")}
                        </GradientButton>
                    </View>}
            </SafeAreaView>
        </>
    );
}
