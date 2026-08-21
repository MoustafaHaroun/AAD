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
 * Primary call-to-action button using the Trade² brand gradient
 * (`prim` → `sec`), matching the Figma design system.
 * @param root0
 * @param root0.children
 * @param root0.className
 * @param root0.disabled
 */
export function GradientButton({
    children,
    className,
    disabled = false,
    ...props
}: GradientButtonProps): React.JSX.Element {
    return (
        <Pressable
            className={cn("overflow-hidden rounded-[10px]", disabled && "opacity-50", className)}
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
