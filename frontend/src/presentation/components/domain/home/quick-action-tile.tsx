import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

interface QuickActionTileProps {
    readonly icon: LucideIcon,
    readonly label: string,
    readonly onPress: (event: GestureResponderEvent) => void,
    readonly variant?: "primary" | "secondary",
}

/**
 * One of the four Home-screen quick-action tiles (New listing / My listings
 * / Chats / Account), matching the Figma design system.
 * @param root0
 * @param root0.icon
 * @param root0.label
 * @param root0.onPress
 * @param root0.variant
 */
export function QuickActionTile({
    icon,
    label,
    onPress,
    variant = "secondary",
}: QuickActionTileProps): React.JSX.Element {
    const content =
        <View className="items-center justify-center gap-1 p-3">
            <Icon as={icon} className={variant === "primary" ? "size-7 text-black" : "size-7 text-forehued"} />

            <Text
                className={
                    variant === "primary"
                        ? "text-[13px] font-noto-semibold text-black"
                        : "text-[13px] font-noto-semibold text-forehued"
                }
            >
                {label}
            </Text>
        </View>
    ;

    if (variant === "primary") {
        return (
            <Pressable
                className="flex-1 overflow-hidden rounded-[10px]"
                onPress={onPress}
            >
                <LinearGradient
                    colors={["#FCC010", "#F28D1B"]}
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                >
                    {content}
                </LinearGradient>
            </Pressable>
        );
    }

    return (
        <Pressable
            className="flex-1 rounded-[10px] bg-primdesat"
            onPress={onPress}
        >
            {content}
        </Pressable>
    );
}
