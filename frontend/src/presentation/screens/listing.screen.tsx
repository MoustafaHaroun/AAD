import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, ScrollView, Share, View } from "react-native";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Text, Icon, Separator } from "@/presentation/components/primitives/rnreusables";
import { MapPin, Pencil, Heart, ImageOff, Share2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
    useGetApiListing,
    useCreateFavorite,
    useDeleteFavorite,
    useGetFavorites,
    useCreateMessage,
    useCurrentUserId,
    useCurrentUser,
    useGetUser,
    useNetworkStatus,
} from "@/presentation/hooks";
import { SwipableImageGallery } from "@/presentation/components/primitives/custom";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";
import { cn } from "@/presentation/utils/cn.util";

/**
 *
 */
export default function ListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: listing } = useGetApiListing(id);
    const { data: favorites } = useGetFavorites();
    const { mutate: createFavorite, isPending: isFavoriting } = useCreateFavorite();
    const { mutate: deleteFavoriteItem, isPending: isUnfavoriting } = useDeleteFavorite();
    const { mutate: sendMessage } = useCreateMessage();
    const currentUserId = useCurrentUserId();
    const currentUser = useCurrentUser();
    const { data: viewer } = useGetUser(currentUserId ?? "");
    const isOnline = useNetworkStatus();

    const favorite = favorites?.find(f => f.listingId === id);
    const isFavorited = favorite != null;
    const canManage = listing != null &&
        (listing.user?.id === currentUserId || currentUser?.role === "admin");
    const distanceLabel = viewer == null ? undefined : formatDistanceLabel(t, viewer, listing?.user ?? {});

    /**
     *
     */
    function toggleFavorite(): void {
        if (isFavoriting || isUnfavoriting || listing == null || !isOnline) { return; }

        if (favorite != null) {
            deleteFavoriteItem({ id: favorite.id });
        } else {
            createFavorite({ listingId: listing.id });
        }
    }

    /**
     *
     */
    function onShare(): void {
        if (listing == null) { return; }

        const url = Linking.createURL(`/listings/${listing.id}`);

        void Share.share({ message: `${listing.title}\n${url}`, title: listing.title, url });
    }

    /**
     *
     */
    function onSendMessage(): void {
        if (listing?.user == null) { return; }
        const posterId = listing.user.id;

        sendMessage(
            { content: t("listing.tradeRequestMessage", { title: listing.title }), recipientId: posterId },
            { onSuccess: () => { router.push(`/chats/${posterId}`); } },
        );
    }

    const attachmentPaths = listing?.attachments?.map(a => a.path) ?? [];

    return (
        <View className="flex-1 bg-background">
            <AppHeader
                right={<>
                    <Pressable
                        accessibilityLabel={t("common.share")}
                        accessibilityRole="button"
                        className="flex items-center justify-center w-8 aspect-square"
                        hitSlop={8}
                        onPress={onShare}
                    >
                        <Icon
                            as={Share2}
                            className="size-5"
                        />
                    </Pressable>

                    {canManage
                        ? <Pressable
                                accessibilityLabel={t("common.edit")}
                                accessibilityRole="button"
                                className="flex items-center justify-center w-8 aspect-square"
                                hitSlop={8}
                                onPress={() => { router.push(`/listings/${id}/edit`); }}
                          >
                            <Icon
                                    as={Pencil}
                                    className="size-5"
                                />
                          </Pressable>
                        : null}
                </>}
            />

            <View className="flex-1 bg-background">
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
                                    accessibilityLabel={isFavorited ? t("common.unfavorite") : t("common.favorite")}
                                    accessibilityRole="button"
                                    className={cn("size-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px]", !isOnline && "opacity-50")}
                                    disabled={!isOnline}
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
                        <GradientButton
                            disabled={!isOnline}
                            onPress={onSendMessage}
                        >
                            {t("listing.sendMessage")}
                        </GradientButton>
                    </View>}
            </View>
        </View>
    );
}
