import { cn } from "@/presentation/utils/cn.util";
import * as SeparatorPrimitive from "@rn-primitives/separator";
import * as React from "react";

/**
 * Render a horizontal or vertical dividing line.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.orientation - The axis the separator runs along.
 * @param props.decorative - Whether the separator is purely visual (hidden from accessibility tools).
 * @returns The rendered separator.
 */
function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: SeparatorPrimitive.RootProps & React.RefAttributes<SeparatorPrimitive.RootRef>): React.JSX.Element {
    return (
        <SeparatorPrimitive.Root
            className={cn(
                "bg-border shrink-0",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className,
            )}
            decorative={decorative}
            orientation={orientation}
            {...props}
        />
    );
}

export { Separator };
