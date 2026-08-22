import * as React from "react";
import { Platform } from "react-native";
import Animated from "react-native-reanimated";

/**
 * Render children as an animated view on native, or plain on web where the
 * animation library has no effect.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
function NativeOnlyAnimatedView(
    props: React.ComponentProps<typeof Animated.View> & React.RefAttributes<Animated.View>,
): React.JSX.Element {
    if (Platform.OS === "web") {
        return <>{props.children as React.ReactNode}</>;
    }

    return <Animated.View {...props} />;
}

export { NativeOnlyAnimatedView };
