import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Pressable, View, type GestureResponderEvent } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { BRAND_COLORS } from "@/presentation/styles/theme";

interface QuickActionIconProps {
    readonly size?: number,
    readonly color?: string,
}

interface QuickActionTileProps {
    readonly icon: React.ComponentType<QuickActionIconProps>,
    readonly label: string,
    readonly onPress: (event: GestureResponderEvent) => void,
    readonly variant?: "primary" | "secondary",
}

/**
 * Render one of the four Home-screen quick-action tiles (New listing / My
 * listings / Chats / Account).
 * @param props - The props.
 * @param props.icon - The icon component rendered inside the tile.
 * @param props.label - The tile's label text.
 * @param props.onPress - Called when the tile is pressed.
 * @param props.variant - The tile's visual style: gradient "primary" or flat "secondary". Defaults to "secondary".
 * @returns The rendered tile.
 */
export function QuickActionTile({
    icon: IconComponent,
    label,
    onPress,
    variant = "secondary",
}: QuickActionTileProps): React.JSX.Element {
    const color = variant === "primary" ? BRAND_COLORS.black : BRAND_COLORS.forehued;

    const content =
        <View className="items-center justify-center gap-1 px-1 py-3">
            <IconComponent
                color={color}
                size={28} />

            <Text
                className={
                    variant === "primary"
                        ? "text-[11px] font-noto-semibold text-black"
                        : "text-[11px] font-noto-semibold text-forehued"
                }
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>;

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
