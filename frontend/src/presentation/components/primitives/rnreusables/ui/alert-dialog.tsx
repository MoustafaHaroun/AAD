import { buttonTextVariants, buttonVariants } from "@/presentation/components/primitives/rnreusables/ui/button";
import { NativeOnlyAnimatedView } from "@/presentation/components/primitives/rnreusables/ui/native-only-animated-view";
import { TextClassContext } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { Platform, View, type ViewProps } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

/**
 * Render the dimmed backdrop behind an alert dialog.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.children - The dialog content to render above the backdrop.
 * @returns The rendered overlay.
 */
function AlertDialogOverlay({
    className,
    children,
    ...props
}: Omit<AlertDialogPrimitive.OverlayProps, "asChild"> &
    React.RefAttributes<AlertDialogPrimitive.OverlayRef> & {
        readonly children?: React.ReactNode,
    }): React.JSX.Element {
    return (
        <FullWindowOverlay>
            <AlertDialogPrimitive.Overlay
                className={cn(
                    "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2",
                    Platform.select({
                        web: "animate-in fade-in-0 fixed",
                    }),
                    className,
                )}
                {...props}
            >
                <NativeOnlyAnimatedView
                    entering={FadeIn.duration(200).delay(50)}
                    exiting={FadeOut.duration(150)}
                >
                    <>{children}</>
                </NativeOnlyAnimatedView>
            </AlertDialogPrimitive.Overlay>
        </FullWindowOverlay>
    );
}

/**
 * Render the alert dialog's content, portaled above its overlay.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @param props.portalHost - The named portal host to render into.
 * @returns The rendered dialog content.
 */
function AlertDialogContent({
    className,
    portalHost,
    ...props
}: AlertDialogPrimitive.ContentProps &
    React.RefAttributes<AlertDialogPrimitive.ContentRef> & {
        readonly portalHost?: string,
    }): React.JSX.Element {
    return (
        <AlertDialogPortal hostName={portalHost}>
            <AlertDialogOverlay>
                <AlertDialogPrimitive.Content
                    className={cn(
                        "bg-background border-border z-50 flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg",
                        Platform.select({
                            web: "animate-in fade-in-0 zoom-in-95 duration-200",
                        }),
                        className,
                    )}
                    {...props}
                />
            </AlertDialogOverlay>
        </AlertDialogPortal>
    );
}

/**
 * Render the alert dialog's header section.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered header.
 */
function AlertDialogHeader({ className, ...props }: ViewProps): React.JSX.Element {
    return (
        <TextClassContext.Provider value="text-center sm:text-left">
            <View
                className={cn("flex flex-col gap-2", className)}
                {...props}
            />
        </TextClassContext.Provider>
    );
}

/**
 * Render the alert dialog's footer section.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered footer.
 */
function AlertDialogFooter({ className, ...props }: ViewProps): React.JSX.Element {
    return (
        <View
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}

/**
 * Render the alert dialog's title text.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered title.
 */
function AlertDialogTitle({
    className,
    ...props
}: AlertDialogPrimitive.TitleProps & React.RefAttributes<AlertDialogPrimitive.TitleRef>): React.JSX.Element {
    return (
        <AlertDialogPrimitive.Title
            className={cn("text-foreground text-lg font-semibold", className)}
            {...props}
        />
    );
}

/**
 * Render the alert dialog's supporting description text.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered description.
 */
function AlertDialogDescription({
    className,
    ...props
}: AlertDialogPrimitive.DescriptionProps &
    React.RefAttributes<AlertDialogPrimitive.DescriptionRef>): React.JSX.Element {
    return (
        <AlertDialogPrimitive.Description
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

/**
 * Render the alert dialog's primary confirm action button.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered action button.
 */
function AlertDialogAction({
    className,
    ...props
}: AlertDialogPrimitive.ActionProps & React.RefAttributes<AlertDialogPrimitive.ActionRef>): React.JSX.Element {
    return (
        <TextClassContext.Provider value={buttonTextVariants({ className })}>
            <AlertDialogPrimitive.Action
                className={cn(buttonVariants(), className)}
                {...props}
            />
        </TextClassContext.Provider>
    );
}

/**
 * Render the alert dialog's cancel/dismiss action button.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered cancel button.
 */
function AlertDialogCancel({
    className,
    ...props
}: AlertDialogPrimitive.CancelProps & React.RefAttributes<AlertDialogPrimitive.CancelRef>): React.JSX.Element {
    return (
        <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
            <AlertDialogPrimitive.Cancel
                className={cn(buttonVariants({ variant: "outline" }), className)}
                {...props}
            />
        </TextClassContext.Provider>
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
};
