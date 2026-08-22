import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Pressable, type PressableProps } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

interface GradientButtonProps extends PressableProps {
    readonly children: string,
    readonly className?: string,
}

/**
 * Render the primary call-to-action button using the Trade² brand gradient.
 * @param props - The props.
 * @param props.children - The button label.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.disabled - Whether the button is disabled.
 * @returns The rendered gradient button.
 */
export function GradientButton({
    children,
    className,
    disabled = false,
    ...props
}: GradientButtonProps): React.JSX.Element {
    return (
        <Pressable
            className={cn("overflow-hidden rounded-[10px]", disabled === true && "opacity-50", className)}
            disabled={disabled}
            {...props}
        >
            <LinearGradient
                colors={["#FCC010", "#F28D1B"]}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ alignItems: "center", justifyContent: "center", paddingVertical: 15 }}
            >
                <Text className="text-[20px] font-noto-bold text-black">{children}</Text>
            </LinearGradient>
        </Pressable>
    );
}
