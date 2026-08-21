import * as React from "react";
import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { View } from "react-native";
import { tokenStore } from "@/infrastructure/api";
import { BottomNav } from "@/presentation/components/containers/bottom-nav";

/**
 *
 */
export default function TabsLayout(): React.JSX.Element | null {
    const router = useRouter();

    useEffect(() => {
        if (tokenStore.get() == null) {
            router.replace("/");
        }
    }, []);

    if (tokenStore.get() == null) {
        return null;
    }

    return (
        <View className="flex-1">
            <Slot />

            <BottomNav />
        </View>
    );
}
