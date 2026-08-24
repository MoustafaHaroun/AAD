import { cn } from "@/presentation/utils/cn.util";
import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";

const textVariants = cva(
    cn(
        "text-base text-foreground font-noto",
        Platform.select({
            web: "select-text",
        }),
    ),
    {
        variants: {
            variant: {
                default: "",
                h1: cn(
                    "text-center text-4xl font-extrabold tracking-tight",
                    Platform.select({ web: "scroll-m-20 text-balance" }),
                ),
                h2: cn(
                    "border-b border-border pb-2 text-3xl font-semibold tracking-tight",
                    Platform.select({ web: "scroll-m-20 first:mt-0" }),
                ),
                h3: cn("text-2xl font-semibold tracking-tight", Platform.select({ web: "scroll-m-20" })),
                h4: cn("text-xl font-semibold tracking-tight", Platform.select({ web: "scroll-m-20" })),
                p: "mt-3 leading-7 sm:mt-6",
                blockquote: "mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
                code: cn(
                    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
                ),
                lead: "text-xl text-muted-foreground",
                large: "text-lg font-semibold",
                small: "text-sm font-medium leading-none",
                muted: "text-sm text-muted-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<TextVariant, Role>> = {
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    blockquote: Platform.select({ web: "blockquote" as Role }),
    code: Platform.select({ web: "code" as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
    h1: "1",
    h2: "2",
    h3: "3",
    h4: "4",
};

const TextClassContext = React.createContext<string | undefined>(undefined);

/**
 * Render themed text, applying the variant's role and accessibility level.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.asChild - Whether to merge props onto the single child instead of rendering a Text element.
 * @param props.variant - The typographic variant.
 * @param props.maxFontSizeMultiplier - The maximum system font-scaling multiplier applied.
 * @returns The rendered text.
 */
function Text({
    className,
    asChild = false,
    variant = "default",
    maxFontSizeMultiplier = 1.5,
    ...props
}: React.ComponentProps<typeof RNText> &
    TextVariantProps &
    React.RefAttributes<RNText> & {
        readonly asChild?: boolean,
    }): React.JSX.Element {
    const textClass = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;

    return (
        <Component
            aria-level={variant ? ARIA_LEVEL[variant] : undefined}
            className={cn(textVariants({ variant }), textClass, className)}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            role={variant ? ROLE[variant] : undefined}
            {...props}
        />
    );
}

export { Text, TextClassContext };
