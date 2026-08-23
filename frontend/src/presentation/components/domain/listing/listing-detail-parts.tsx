/* eslint-disable react/no-multi-comp -- co-located private view fragments for the listing detail screen */
import * as React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Icon, Separator } from "@/presentation/components/primitives/rnreusables";
import { MapPin, Pencil, Heart, ImageOff, Share2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SwipableImageGallery } from "@/presentation/components/primitives/custom";
import { cn } from "@/presentation/utils/cn.util";
import type { ApiListing } from "@/domain/entities";

interface ListingHeaderActionsProps {
    readonly canManage: boolean,
    readonly onShare: () => void,
    readonly onEdit: () => void,
}

/**
 * Render the listing detail header's share button, plus an edit button for the owner/admin.
 * @param props - The props.
 * @param props.canManage - Whether the viewer may edit this listing.
 * @param props.onShare - Called when the share button is pressed.
 * @param props.onEdit - Called when the edit button is pressed.
 * @returns The rendered header actions.
 */
export function ListingHeaderActions({ canManage, onShare, onEdit }: ListingHeaderActionsProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <>
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
                        onPress={onEdit}
                    >
                        <Icon
                            as={Pencil}
                            className="size-5"
                        />
                    </Pressable>
                : null}
        </>
    );
}

interface FavoriteToggleProps {
    readonly isFavorited: boolean,
    readonly isOnline: boolean,
    readonly onPress: () => void,
}

/**
 * Render the listing detail page's favorite toggle button.
 * @param props - The props.
 * @param props.isFavorited - Whether the listing is currently favorited.
 * @param props.isOnline - Whether the device has a network connection.
 * @param props.onPress - Called when the button is pressed.
 * @returns The rendered favorite toggle.
 */
export function FavoriteToggle({ isFavorited, isOnline, onPress }: FavoriteToggleProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <Pressable
            accessibilityLabel={isFavorited ? t("common.unfavorite") : t("common.favorite")}
            accessibilityRole="button"
            className={cn("size-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px]", !isOnline && "opacity-50")}
            disabled={!isOnline}
            onPress={onPress}
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
    );
}

interface ListingCoverProps {
    readonly attachmentPaths: string[],
}

/**
 * Render the listing's photo gallery, or a placeholder icon when it has none.
 * @param props - The props.
 * @param props.attachmentPaths - The listing's attachment paths, in order.
 * @returns The rendered cover.
 */
export function ListingCover({ attachmentPaths }: ListingCoverProps): React.JSX.Element {
    if (attachmentPaths.length > 0) {
        return <SwipableImageGallery uris={attachmentPaths} />;
    }

    return (
        <View className="w-full aspect-video items-center justify-center bg-muted">
            <Icon
                as={ImageOff}
                className="size-12 text-muted-foreground"
            />
        </View>
    );
}

interface ListingOwnerInfoProps {
    readonly firstname?: string,
    readonly surname?: string,
    readonly location?: string | null,
    readonly distanceLabel?: string,
}

/**
 * Render the listing owner's name, location, and distance from the viewer.
 * @param props - The props.
 * @param props.firstname - The owner's first name.
 * @param props.surname - The owner's surname.
 * @param props.location - The owner's location label, if known.
 * @param props.distanceLabel - A precomputed "N km away" label, if the viewer's location is known.
 * @returns The rendered owner info block.
 */
export function ListingOwnerInfo({ firstname, surname, location, distanceLabel }: ListingOwnerInfoProps): React.JSX.Element {
    return (
        <View className="flex flex-col gap-1">
            <Text className="text-[28px] font-noto-bold text-black">
                {`${firstname ?? ""} ${surname ?? ""}`}
            </Text>

            {location != null &&
                <View className="flex flex-row items-center gap-1">
                    <Icon
                        as={MapPin}
                        className="size-4 text-forehued"
                    />

                    <Text className="font-noto-semibold text-[16px] text-forehued">
                        {location}
                    </Text>
                </View>}

            {distanceLabel != null &&
                <Text className="font-noto-medium text-[14px] text-forehued">
                    {distanceLabel}
                </Text>}
        </View>
    );
}

interface ListingStatusProps {
    readonly isLoading: boolean,
    readonly hasError: boolean,
    readonly isOnline: boolean,
}

/**
 * Render the listing detail page's loading spinner or load-error message.
 * @param props - The props.
 * @param props.isLoading - Whether the listing is still loading for the first time.
 * @param props.hasError - Whether the listing failed to load and no cached copy exists.
 * @param props.isOnline - Whether the device has a network connection.
 * @returns The rendered status block, or null once loaded.
 */
export function ListingStatus({ isLoading, hasError, isOnline }: ListingStatusProps): React.JSX.Element | null {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <View className="items-center justify-center p-8">
                <ActivityIndicator />
            </View>
        );
    }

    if (hasError) {
        return (
            <View className="items-center justify-center p-8">
                <Text className="text-center text-sm text-destructive">
                    {isOnline ? t("common.loadError") : t("common.notAvailableOffline")}
                </Text>
            </View>
        );
    }

    return null;
}

interface ListingDetailsProps {
    readonly listing: ApiListing,
    readonly distanceLabel?: string,
    readonly isFavorited: boolean,
    readonly isOnline: boolean,
    readonly onToggleFavorite: () => void,
}

/**
 * Render a loaded listing's owner info, title, favorite toggle, and description.
 * @param props - The props.
 * @param props.listing - The loaded listing.
 * @param props.distanceLabel - A precomputed "N km away" label, if the viewer's location is known.
 * @param props.isFavorited - Whether the listing is currently favorited.
 * @param props.isOnline - Whether the device has a network connection.
 * @param props.onToggleFavorite - Called when the favorite toggle is pressed.
 * @returns The rendered details block.
 */
export function ListingDetails({ listing, distanceLabel, isFavorited, isOnline, onToggleFavorite }: ListingDetailsProps): React.JSX.Element {
    return (
        <View className="flex flex-col gap-4 p-4">

            {/* User info */}
            <ListingOwnerInfo
                distanceLabel={distanceLabel}
                firstname={listing.user?.firstname}
                location={listing.user?.location}
                surname={listing.user?.surname}
            />

            <Separator />

            {/* Title + Favorite */}
            <View className="flex flex-row items-start justify-between gap-4">
                <Text className="flex-1 text-[24px] font-noto-bold text-black">{listing.title}</Text>

                <FavoriteToggle
                    isFavorited={isFavorited}
                    isOnline={isOnline}
                    onPress={onToggleFavorite}
                />
            </View>

            {/* Description */}
            {listing.description == null
                ? null
                : <Text className="font-noto text-[16px] leading-relaxed text-black">
                        {listing.description}
                    </Text>}
        </View>
    );
}
