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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SwipableImageGalleryProps {
    uris: string[];
}

export function SwipableImageGallery({ uris }: SwipableImageGalleryProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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
                        style={{ width: SCREEN_WIDTH }}
                    >
                        <Image
                            className="aspect-video w-full"
                            source={{ uri }}
                            resizeMode="contain"
                        />
                    </Pressable>
                ))}
            </ScrollView>


            <View className="absolute bg-foreground px-3 py-1.5 bottom-2 self-center rounded-2xl opacity-80">
                <Text className="text-background text-xs font-semibold">
                    {currentIndex + 1} / {validUris.length}
                </Text>
            </View>
        </View>
    );
}
