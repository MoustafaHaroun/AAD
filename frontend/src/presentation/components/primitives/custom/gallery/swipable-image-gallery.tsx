import { Text } from "@/presentation/components/primitives/rnreusables";
import {
    Image,
    Pressable,
    ScrollView,
    View,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent
} from "react-native";
import { useState, useRef } from "react";
import { FullscreenImageViewer } from "@/presentation/components/primitives/custom/gallery/fullscreen-image-viewer";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SwipableImageGalleryProps {
    uris: string[];
}

export function SwipableImageGallery({ uris }: SwipableImageGalleryProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    const validUris = uris?.filter(uri => uri != null) ?? [];

    if (validUris.length === 0) {
        return null;
    }

    function handleScroll(event: any) {
        const offsetX: number = event.nativeEvent.contentOffset.x;
        const index: number = Math.round(offsetX / SCREEN_WIDTH);

        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    }

    function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const offsetX: number = event.nativeEvent.contentOffset.x;
        const index: number = Math.round(offsetX / SCREEN_WIDTH);

        setCurrentIndex(index);
    }

    return (
        <View className="relative w-full bg-black">
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={16}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                className="w-full"
            >
                {validUris.map((uri, index) => (
                    <Pressable
                        key={`${uri}-${index}`}
                        onPress={() => setFullscreenOpen(true)}
                        style={{ width: SCREEN_WIDTH }}
                    >
                        <Image
                            className="aspect-video w-full"
                            source={{ uri }}
                            resizeMode="cover"
                        />
                    </Pressable>
                ))}
            </ScrollView>


            <View className="absolute bg-foreground px-3 py-1.5 bottom-2 self-center rounded-2xl opacity-80">
                <Text className="text-background text-xs font-semibold">
                    {currentIndex + 1} / {validUris.length}
                </Text>
            </View>

            <FullscreenImageViewer
                initialIndex={currentIndex}
                onClose={() => setFullscreenOpen(false)}
                uris={validUris}
                visible={fullscreenOpen}
            />
        </View>
    );
}
