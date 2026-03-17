import { cn } from "@/presentation/utils/cn.util";
import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";

type IconProps = LucideProps & {
    readonly as: LucideIcon,
};

/**
 *
 * @param root0
 * @param root0.as
 */
function IconImpl({ as: IconComponent, ...props }: IconProps) {
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
 * A wrapper component for Lucide icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `nativewind`. It avoids the need to wrap or configure each icon individually.
 * @param as - The Lucide icon component to render.
 * @param as.as
 * @param className - Utility classes to style the icon using Nativewind.
 * @param as.className
 * @param size - Icon size (defaults to 14).
 * @param as.size
 * @param ...props - Additional Lucide icon props passed to the "as" icon.
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500" size={16} />
 * ```
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
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
