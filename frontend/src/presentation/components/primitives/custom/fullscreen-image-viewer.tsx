import * as React from "react";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    View,
    useWindowDimensions,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

export interface FullscreenImageViewerProps {
    readonly uris: string[],
    readonly initialIndex: number,
    readonly visible: boolean,
    readonly onClose: () => void,
}

/**
 * Render a fullscreen, swipeable image lightbox.
 * @param props - The props.
 * @param props.uris - The image URIs to display, in order.
 * @param props.initialIndex - The index to open the lightbox on.
 * @param props.visible - Whether the lightbox is shown.
 * @param props.onClose - Called when the close button or backdrop is pressed.
 * @returns The rendered lightbox modal.
 */
export function FullscreenImageViewer({
    uris,
    initialIndex,
    visible,
    onClose,
}: FullscreenImageViewerProps): React.JSX.Element {
    const { t } = useTranslation();
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const [index, setIndex] = useState(initialIndex);

    /**
     * Update the tracked page index as the lightbox settles on a page.
     * @param event - The scroll event.
     */
    function onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>): void {
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
                    {uris.map(uri => <View
                        className="items-center justify-center"
                        key={uri}
                        style={{ width: SCREEN_WIDTH }}
                    >
                        <Image
                            resizeMode="contain"
                            source={{ uri }}
                            style={{ height: "100%", width: SCREEN_WIDTH }}
                        />
                    </View>)}
                </ScrollView>

                <SafeAreaView
                    className="absolute left-0 right-0 top-0"
                    edges={["top"]}
                >
                    <View className="flex-row items-center justify-between p-4">
                        <Pressable
                            accessibilityLabel={t("common.close")}
                            accessibilityRole="button"
                            className="size-10 items-center justify-center rounded-full bg-black/50"
                            hitSlop={8}
                            onPress={onClose}
                        >
                            <Icon
                                as={X}
                                className="size-6 text-white"
                            />
                        </Pressable>

                        {uris.length > 1 &&
                            <View className="rounded-full bg-black/50 px-3 py-1.5">
                                <Text className="text-xs font-semibold text-white">
                                    {`${index + 1} / ${uris.length}`}
                                </Text>
                            </View>}
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}
