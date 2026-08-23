import { Text } from "@/presentation/components/primitives/rnreusables";
import {
    Image,
    Pressable,
    ScrollView,
    View,
    Dimensions,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import * as React from "react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FullscreenImageViewer } from "@/presentation/components/primitives/custom/fullscreen-image-viewer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface SwipableImageGalleryProps {
    readonly uris: string[],
}

/**
 * Render a horizontally paginated image gallery that opens a fullscreen viewer on tap.
 * @param props - The props.
 * @param props.uris - The image URIs to display, in order.
 * @returns The rendered gallery, or null if no valid URIs are given.
 */
export function SwipableImageGallery({ uris }: SwipableImageGalleryProps): React.JSX.Element | null {
    const { t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    const validUris = uris;

    if (validUris.length === 0) {
        return null;
    }

    /**
     * Update the current page index as the gallery is dragged.
     * @param event - The scroll event.
     */
    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
        const offsetX: number = event.nativeEvent.contentOffset.x;
        const index: number = Math.round(offsetX / SCREEN_WIDTH);

        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    }

    /**
     * Snap the current page index to the page the gallery settled on.
     * @param event - The scroll event.
     */
    function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void {
        const offsetX: number = event.nativeEvent.contentOffset.x;
        const index: number = Math.round(offsetX / SCREEN_WIDTH);

        setCurrentIndex(index);
    }

    return (
        <View className="relative w-full bg-black">
            <ScrollView
                className="w-full"
                decelerationRate="fast"
                horizontal
                onMomentumScrollEnd={handleMomentumScrollEnd}
                onScroll={handleScroll}
                pagingEnabled
                ref={scrollViewRef}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
            >
                {validUris.map((uri, index) => <Pressable
                    accessibilityLabel={t("common.viewPhoto", { index: index + 1, total: validUris.length })}
                    accessibilityRole="imagebutton"
                    key={uri}
                    onPress={() => { setFullscreenOpen(true); }}
                    style={{ width: SCREEN_WIDTH }}
                >
                    <Image
                        className="aspect-video w-full"
                        resizeMode="cover"
                        source={{ uri }}
                    />
                </Pressable>)}
            </ScrollView>

            <View className="absolute bg-foreground px-3 py-1.5 bottom-2 self-center rounded-2xl opacity-80">
                <Text className="text-background text-xs font-semibold">
                    {`${currentIndex + 1} / ${validUris.length}`}
                </Text>
            </View>

            <FullscreenImageViewer
                initialIndex={currentIndex}
                onClose={() => { setFullscreenOpen(false); }}
                uris={validUris}
                visible={fullscreenOpen}
            />
        </View>
    );
}
