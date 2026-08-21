import * as React from "react";
import { Pressable, type PressableProps } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

interface SecondaryButtonProps extends PressableProps {
    readonly children: string,
    readonly className?: string,
}

/**
 * Secondary/desaturated button (e.g. "Back", "Register" on the landing
 * screen), matching the Figma design system.
 * @param root0
 * @param root0.children
 * @param root0.className
 * @param root0.disabled
 */
export function SecondaryButton({
    children,
    className,
    disabled = false,
    ...props
}: SecondaryButtonProps): React.JSX.Element {
    return (
        <Pressable
            className={cn(
                "items-center justify-center rounded-[10px] bg-primdesat py-[15px]",
                disabled && "opacity-50",
                className,
            )}
            disabled={disabled}
            {...props}
        >
            <Text className="text-[20px] font-noto-bold text-forehued">{children}</Text>
        </Pressable>
    );
}
