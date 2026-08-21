import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

interface ComingSoonScreenProps {
    readonly title: string,
}

/**
 *
 * @param root0
 * @param root0.title
 */
export default function ComingSoonScreen({ title }: ComingSoonScreenProps): React.JSX.Element {
    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, title }} />

            <View className="flex-1 items-center justify-center bg-background px-6">
                <Text className="text-center text-muted-foreground">
                    {title} is coming soon.
                </Text>
            </View>
        </>
    );
}
