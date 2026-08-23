import { cn } from "@/presentation/utils/cn.util";
import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";
import { Platform } from "react-native";

/**
 * Render a form label whose press events also activate the associated field.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.onPress - Called when the label is pressed.
 * @param props.onLongPress - Called when the label is long-pressed.
 * @param props.onPressIn - Called when a press on the label begins.
 * @param props.onPressOut - Called when a press on the label ends.
 * @param props.disabled - Whether the label (and its field) is disabled.
 * @returns The rendered label.
 */
function Label({
    className,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    disabled,
    ...props
}: LabelPrimitive.TextProps & React.RefAttributes<LabelPrimitive.TextRef>): React.JSX.Element {
    return (
        <LabelPrimitive.Root
            className={cn(
                "flex select-none flex-row items-center gap-2",
                Platform.select({
                    web: "cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
                }),
                disabled === true && "opacity-50",
            )}
            disabled={disabled}
            onLongPress={onLongPress}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
        >
            <LabelPrimitive.Text
                className={cn(
                    "text-foreground text-sm font-medium",
                    Platform.select({ web: "leading-none" }),
                    className,
                )}
                {...props}
            />
        </LabelPrimitive.Root>
    );
}

export { Label };
