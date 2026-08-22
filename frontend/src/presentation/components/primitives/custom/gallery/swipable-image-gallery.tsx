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
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FullscreenImageViewer } from "@/presentation/components/primitives/custom/gallery/fullscreen-image-viewer";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface SwipableImageGalleryProps {
    readonly uris: string[],
}

/**
 *
 * @param root0
 * @param root0.uris
 */
export function SwipableImageGallery({ uris }: SwipableImageGalleryProps) {
    const { t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    const validUris = uris?.filter(uri => uri != null) ?? [];

    if (validUris.length === 0) {
        return null;
    }

    /**
     *
     * @param event
     */
    function handleScroll(event: any) {
        const offsetX: number = event.nativeEvent.contentOffset.x;
        const index: number = Math.round(offsetX / SCREEN_WIDTH);

        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    }

    /**
     *
     * @param event
     */
    function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
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
                        key={`${uri}-${index}`}
                        onPress={() => { setFullscreenOpen(true); }}
                        style={{ width: SCREEN_WIDTH }}
                    >
                        <Image
                            className="aspect-video w-full"
                            resizeMode="cover"
                            source={{ uri }}
                        />
                     </Pressable>,)}
            </ScrollView>

            <View className="absolute bg-foreground px-3 py-1.5 bottom-2 self-center rounded-2xl opacity-80">
                <Text className="text-background text-xs font-semibold">
                    {currentIndex + 1} / {validUris.length}
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
