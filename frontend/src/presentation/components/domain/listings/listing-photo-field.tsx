/* eslint-disable react/no-multi-comp -- co-located private view fragments for the create/edit listing photo picker */
import * as React from "react";
import { Image, Pressable, View } from "react-native";
import { Plus, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { cn } from "@/presentation/utils/cn.util";

interface AddPhotoButtonProps {
    readonly isOnline: boolean,
    readonly onPress: () => void,
}

/**
 * Render the "+" button that opens the camera/gallery picker for a new listing photo.
 * @param props - The props.
 * @param props.isOnline - Whether the device has a network connection.
 * @param props.onPress - Called when the button is pressed.
 * @returns The rendered button.
 */
export function AddPhotoButton({ isOnline, onPress }: AddPhotoButtonProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <Pressable
            accessibilityLabel={t("common.addPhoto")}
            accessibilityRole="button"
            className={cn("h-20 w-20 items-center justify-center rounded-[10px] bg-surfhued", !isOnline && "opacity-50")}
            disabled={!isOnline}
            onPress={onPress}
        >
            <View className="size-12 items-center justify-center rounded-full bg-forehued">
                <Icon
                    as={Plus}
                    className="size-6 text-white"
                />
            </View>
        </Pressable>
    );
}

interface TapToRemoveThumbnailProps {
    readonly uri: string,
    readonly onRemove: () => void,
}

/**
 * Render a not-yet-uploaded listing photo thumbnail; tapping it removes the photo.
 * @param props - The props.
 * @param props.uri - The photo's local URI.
 * @param props.onRemove - Called when the thumbnail is tapped.
 * @returns The rendered thumbnail.
 */
export function TapToRemoveThumbnail({ uri, onRemove }: TapToRemoveThumbnailProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <Pressable
            accessibilityLabel={t("common.removePhoto")}
            accessibilityRole="button"
            onPress={onRemove}
        >
            <Image
                className="h-20 w-20 rounded-[10px]"
                resizeMode="cover"
                source={{ uri }}
            />
        </Pressable>
    );
}

interface AttachmentThumbnailProps {
    readonly uri: string,
    readonly onRemove: () => void,
    readonly removeDisabled?: boolean,
}

/**
 * Render an already-uploaded listing photo thumbnail with a small remove badge.
 * @param props - The props.
 * @param props.uri - The photo's remote URI.
 * @param props.onRemove - Called when the remove badge is pressed.
 * @param props.removeDisabled - Whether the remove badge is disabled (e.g. while offline).
 * @returns The rendered thumbnail.
 */
export function AttachmentThumbnail({ uri, onRemove, removeDisabled = false }: AttachmentThumbnailProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="relative">
            <Image
                className="h-20 w-20 rounded-[10px]"
                resizeMode="cover"
                source={{ uri }}
            />

            <Pressable
                accessibilityLabel={t("common.removePhoto")}
                accessibilityRole="button"
                className={cn("absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-forehued", removeDisabled && "opacity-50")}
                disabled={removeDisabled}
                hitSlop={8}
                onPress={onRemove}
            >
                <Icon
                    as={X}
                    className="size-3 text-white"
                />
            </Pressable>
        </View>
    );
}
