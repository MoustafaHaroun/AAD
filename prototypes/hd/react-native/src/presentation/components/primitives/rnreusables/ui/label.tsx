import { cn } from "@/presentation/utils/cn.util";
import * as LabelPrimitive from "@rn-primitives/label";
import { Platform } from "react-native";

/**
 *
 * @param root0
 * @param root0.className
 * @param root0.onPress
 * @param root0.onLongPress
 * @param root0.onPressIn
 * @param root0.onPressOut
 * @param root0.disabled
 */
function Label({
    className,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    disabled,
    ...props
}: LabelPrimitive.TextProps & React.RefAttributes<LabelPrimitive.TextRef>) {
    return (
        <LabelPrimitive.Root
            className={cn(
                "flex select-none flex-row items-center gap-2",
                Platform.select({
                    web: "cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
                }),
                disabled && "opacity-50",
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
