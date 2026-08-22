import * as React from "react";
import { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface FullscreenImageViewerProps {
    readonly uris: string[];
    readonly initialIndex: number;
    readonly visible: boolean;
    readonly onClose: () => void;
}

/**
 * A fullscreen, swipeable image lightbox opened by tapping a gallery image.
 */
export function FullscreenImageViewer({
    uris,
    initialIndex,
    visible,
    onClose,
}: FullscreenImageViewerProps): React.JSX.Element {
    const [index, setIndex] = useState(initialIndex);

    function onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
        setIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
    }

    return (
        <Modal
            animationType="fade"
            onRequestClose={onClose}
            transparent
            visible={visible}
        >
            <View className="flex-1 bg-black">
                <ScrollView
                    contentOffset={{ x: initialIndex * SCREEN_WIDTH, y: 0 }}
                    horizontal
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    {uris.map((uri, i) => (
                        <View className="items-center justify-center" key={`${uri}-${i}`} style={{ width: SCREEN_WIDTH }}>
                            <Image
                                resizeMode="contain"
                                source={{ uri }}
                                style={{ height: "100%", width: SCREEN_WIDTH }}
                            />
                        </View>
                    ))}
                </ScrollView>

                <SafeAreaView className="absolute left-0 right-0 top-0" edges={["top"]}>
                    <View className="flex-row items-center justify-between p-4">
                        <Pressable
                            className="size-10 items-center justify-center rounded-full bg-black/50"
                            hitSlop={8}
                            onPress={onClose}
                        >
                            <Icon as={X} className="size-6 text-white" />
                        </Pressable>

                        {uris.length > 1 && (
                            <View className="rounded-full bg-black/50 px-3 py-1.5">
                                <Text className="text-xs font-semibold text-white">
                                    {index + 1} / {uris.length}
                                </Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}
