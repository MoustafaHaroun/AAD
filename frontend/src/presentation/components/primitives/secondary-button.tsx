import * as React from "react";
import { Pressable, type PressableProps } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

interface SecondaryButtonProps extends PressableProps {
    readonly children: string,
    readonly className?: string,
}

/**
 * Render a secondary, desaturated button (e.g. "Back", "Register" on the landing screen).
 * @param props - The props.
 * @param props.children - The button label.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.disabled - Whether the button is disabled.
 * @returns The rendered secondary button.
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
                disabled === true && "opacity-50",
                className,
            )}
            disabled={disabled}
            {...props}
        >
            <Text className="text-[20px] font-noto-bold text-forehued">{children}</Text>
        </Pressable>
    );
}
