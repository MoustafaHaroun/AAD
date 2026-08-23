import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { RefreshControl, ScrollView, Share, View } from "react-native";
import * as Linking from "expo-linking";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { useTranslation } from "react-i18next";
import {
    useGetApiListing,
    useCreateFavorite,
    useDeleteFavorite,
    useGetFavorites,
    useCreateMessage,
    useConversations,
    useCurrentUserId,
    useCurrentUser,
    useGetUser,
    useNetworkStatus,
} from "@/presentation/hooks";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { formatDistanceLabel } from "@/presentation/utils/distance.util";
import { canManageListing } from "@/presentation/utils/listing-permissions.util";
import {
    ListingHeaderActions,
    ListingStatus,
    ListingCover,
    ListingDetails,
} from "@/presentation/components/domain/listing/listing-detail-parts";
import type { ApiListing } from "@/domain/entities";

/**
 * Format the distance from the viewer to a listing's owner, when both locations are known.
 * @param t - The translation function.
 * @param viewer - The viewer's own coordinates, if their location is known.
 * @param listing - The loaded listing, if any.
 * @returns The formatted distance label, or undefined.
 */
function getListingDistanceLabel(
    t: ReturnType<typeof useTranslation>["t"],
    viewer: Parameters<typeof formatDistanceLabel>[1] | undefined,
    listing: ApiListing | undefined,
): string | undefined {
    if (viewer == null) {
        return undefined;
    }

    return formatDistanceLabel(t, viewer, listing?.user ?? {});
}

/**
 * Get a listing's attachment paths, in order.
 * @param listing - The loaded listing, if any.
 * @returns The attachment paths, or an empty array if the listing has none loaded yet.
 */
function getAttachmentPaths(listing: ApiListing | undefined): string[] {
    if (listing?.attachments == null) {
        return [];
    }

    return listing.attachments.map(a => a.path);
}

/**
 * Determine whether the viewer is the listing's own poster.
 * @param listing - The loaded listing, if any.
 * @param currentUserId - The viewer's user id, if signed in.
 * @returns Whether the viewer posted this listing.
 */
function computeIsOwnListing(listing: ApiListing | undefined, currentUserId: string | null): boolean {
    if (listing?.user == null) {
        return false;
    }

    return listing.user.id === currentUserId;
}

interface ListingScreenState {
    id: string,
    router: ReturnType<typeof useRouter>,
    t: ReturnType<typeof useTranslation>["t"],
    listing: ReturnType<typeof useGetApiListing>["data"],
    isLoading: boolean,
    isFetching: boolean,
    error: Error | null,
    refetch: () => unknown,
    isOnline: boolean,
    isFavorited: boolean,
    canManage: boolean,
    isOwnListing: boolean,
    distanceLabel: string | undefined,
    attachmentPaths: string[],
    favorite: { id: string } | undefined,
    isFavoriting: boolean,
    isUnfavoriting: boolean,
    createFavorite: ReturnType<typeof useCreateFavorite>["mutate"],
    deleteFavoriteItem: ReturnType<typeof useDeleteFavorite>["mutate"],
    sendMessage: ReturnType<typeof useCreateMessage>["mutate"],
    conversations: ReturnType<typeof useConversations>["conversations"],
}

/**
 * Load a listing and assemble the derived state its detail page needs.
 * @returns The listing screen's view state.
 */
function useListingScreenState(): ListingScreenState {
    const router = useRouter();
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: listing, isLoading, isFetching, error, refetch } = useGetApiListing(id);
    const { data: favorites } = useGetFavorites();
    const { mutate: createFavorite, isPending: isFavoriting } = useCreateFavorite();
    const { mutate: deleteFavoriteItem, isPending: isUnfavoriting } = useDeleteFavorite();
    const { mutate: sendMessage } = useCreateMessage();
    const { conversations } = useConversations();
    const currentUserId = useCurrentUserId();
    const currentUser = useCurrentUser();
    const { data: viewer } = useGetUser(currentUserId ?? "");
    const isOnline = useNetworkStatus();

    const favorite = favorites?.find(f => f.listingId === id);
    const isFavorited = favorite != null;
    const canManage = canManageListing(listing, currentUserId, currentUser?.role);
    const isOwnListing = computeIsOwnListing(listing, currentUserId);
    const distanceLabel = getListingDistanceLabel(t, viewer, listing);
    const attachmentPaths = getAttachmentPaths(listing);

    return {
        id,
        router,
        t,
        listing,
        isLoading,
        isFetching,
        error,
        refetch,
        isOnline,
        isFavorited,
        canManage,
        isOwnListing,
        distanceLabel,
        attachmentPaths,
        favorite,
        isFavoriting,
        isUnfavoriting,
        createFavorite,
        deleteFavoriteItem,
        sendMessage,
        conversations,
    };
}

/**
 * Build the listing detail page's favorite/share/trade-request handlers.
 * @param state - The listing screen's loaded state, from {@link useListingScreenState}.
 * @returns The handlers used by the listing detail page.
 */
function useListingActions(state: ReturnType<typeof useListingScreenState>): {
    toggleFavorite: () => void,
    onShare: () => void,
    onSendMessage: () => void,
} {
    const { router, t, listing, isOnline, favorite, isFavoriting, isUnfavoriting, createFavorite, deleteFavoriteItem, sendMessage, conversations } = state;

    /**
     * Favorite or unfavorite the listing.
     */
    function toggleFavorite(): void {
        if (isFavoriting || isUnfavoriting || listing == null || !isOnline) {
            return;
        }

        if (favorite == null) {
            createFavorite({ listingId: listing.id });
        } else {
            deleteFavoriteItem({ id: favorite.id });
        }
    }

    /**
     * Open the native share sheet with a link to this listing.
     */
    function onShare(): void {
        if (listing == null) {
            return;
        }

        const url = Linking.createURL(`/listings/${listing.id}`);

        void Share.share({ message: `${listing.title}\n${url}`, title: listing.title, url });
    }

    /**
     * Open the conversation with the listing's poster, sending the canned trade-request
     * message only the first time a conversation with them is started.
     */
    function onSendMessage(): void {
        if (listing?.user == null) {
            return;
        }

        const posterId = listing.user.id;
        const hasExistingConversation = conversations?.some(c => c.counterpart.id === posterId) ?? false;

        if (hasExistingConversation) {
            router.push(`/chats/${posterId}`);
            return;
        }

        sendMessage(
            { content: t("listing.tradeRequestMessage", { title: listing.title }), recipientId: posterId },
            { onSuccess: () => { router.push(`/chats/${posterId}`); } },
        );
    }

    return { toggleFavorite, onShare, onSendMessage };
}

/**
 * Render a listing's detail page with favoriting, sharing, and starting a trade chat.
 * @returns The rendered listing screen.
 */
export default function ListingScreen(): React.JSX.Element {
    const state = useListingScreenState();
    const {
        id, router, listing, isLoading, isFetching, error, refetch, isOnline,
        isFavorited, canManage, isOwnListing, distanceLabel, attachmentPaths, t,
    } = state;
    const { toggleFavorite, onShare, onSendMessage } = useListingActions(state);

    return (
        <View className="flex-1 bg-background">
            <AppHeader
                right={<ListingHeaderActions
                    canManage={canManage}
                    onEdit={() => { router.push(`/listings/${id}/edit`); }}
                    onShare={onShare}
                />}
            />

            <View className="flex-1 bg-background">
                <ScrollView
                    bounces
                    className="flex-1"
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => { void refetch(); }}
                            refreshing={isFetching ? !isLoading : false}
                        />
                    }
                >

                    <ListingStatus
                        hasError={error != null && listing == null}
                        isLoading={isLoading}
                        isOnline={isOnline}
                    />

                    {/* Gallery */}
                    {listing == null ? null : <ListingCover attachmentPaths={attachmentPaths} />}

                    {listing == null
                        ? null
                        : <ListingDetails
                                distanceLabel={distanceLabel}
                                isFavorited={isFavorited}
                                isOnline={isOnline}
                                listing={listing}
                                onToggleFavorite={toggleFavorite}
                            />}
                </ScrollView>

                {/* Fixed bottom CTA */}
                {listing != null && !isOwnListing
                    ? <View className="border-t border-border bg-background px-4 pb-4 pt-3">
                            <GradientButton
                                disabled={!isOnline}
                                onPress={onSendMessage}
                            >
                                {t("listing.sendMessage")}
                            </GradientButton>
                        </View>
                    : null}
            </View>
        </View>
    );
}
