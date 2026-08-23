import { Link, Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

/**
 * Render the fallback screen shown for an unmatched route.
 * @returns The rendered not-found screen.
 */
export default function NotFoundScreen(): React.JSX.Element {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />

            <View>
                <Text>This screen doesn&apos;t exist.</Text>

                <Link href="/">
                    <Text>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
