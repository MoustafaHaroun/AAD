import { NativeOnlyAnimatedView } from "@/presentation/components/primitives/rnreusables/ui/native-only-animated-view";
import { TextClassContext } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";
import * as PopoverPrimitive from "@rn-primitives/popover";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverClose = PopoverPrimitive.Close;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

/**
 * Render the popover's content, portaled above its trigger.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.align - The alignment relative to the trigger.
 * @param props.sideOffset - The offset in pixels from the trigger.
 * @param props.portalHost - The named portal host to render into.
 * @returns The rendered popover content.
 */
function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    portalHost,
    ...props
}: PopoverPrimitive.ContentProps &
    React.RefAttributes<PopoverPrimitive.ContentRef> & {
        readonly portalHost?: string,
    }): React.JSX.Element {
    return (
        <PopoverPrimitive.Portal hostName={portalHost}>
            <FullWindowOverlay>
                <PopoverPrimitive.Overlay style={Platform.select({ native: StyleSheet.absoluteFill })}>
                    <NativeOnlyAnimatedView
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut}
                    >
                        <TextClassContext.Provider value="text-popover-foreground">
                            <PopoverPrimitive.Content
                                align={align}
                                className={cn(
                                    "bg-popover border-border outline-hidden z-50 w-72 rounded-md border p-4 shadow-md shadow-black/5",
                                    Platform.select({
                                        web: cn(
                                            "animate-in fade-in-0 zoom-in-95 origin-(--radix-popover-content-transform-origin) cursor-auto",
                                            props.side === "bottom" && "slide-in-from-top-2",
                                            props.side === "top" && "slide-in-from-bottom-2",
                                        ),
                                    }),
                                    className,
                                )}
                                sideOffset={sideOffset}
                                {...props}
                            />
                        </TextClassContext.Provider>
                    </NativeOnlyAnimatedView>
                </PopoverPrimitive.Overlay>
            </FullWindowOverlay>
        </PopoverPrimitive.Portal>
    );
}

export { Popover, PopoverContent, PopoverTrigger, PopoverClose };
