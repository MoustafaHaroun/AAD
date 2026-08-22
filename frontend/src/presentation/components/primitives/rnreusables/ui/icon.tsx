import { cn } from "@/presentation/utils/cn.util";
import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";
import * as React from "react";

type IconProps = LucideProps & {
    readonly as: LucideIcon,
};

/**
 * Render the given Lucide icon component with its forwarded props.
 * @param props - The props.
 * @param props.as - The Lucide icon component to render.
 * @returns The rendered icon.
 */
function IconImpl({ as: IconComponent, ...props }: IconProps): React.JSX.Element {
    return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
    className: {
        target: "style",
        nativeStyleToProp: {
            height: "size",
            width: "size",
        },
    },
});

/**
 * Render a Lucide icon with NativeWind `className` support via `cssInterop`.
 * @param props - The props.
 * @param props.as - The Lucide icon component to render.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.size - The icon size.
 * @returns The rendered icon.
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500" size={16} />
 * ```
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps): React.JSX.Element {
    return (
        <IconImpl
            as={IconComponent}
            className={cn("text-foreground", className)}
            size={size}
            {...props}
        />
    );
}

export { Icon };
