import * as React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { Trash } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/presentation/components/primitives/rnreusables";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { cn } from "@/presentation/utils/cn.util";

interface DeleteListingDialogProps {
    readonly disabled: boolean,
    readonly isDeleting: boolean,
    readonly onConfirm: () => void,
}

/**
 * Render the edit-listing screen's delete button and its confirmation dialog.
 * @param props - The props.
 * @param props.disabled - Whether the delete button is disabled.
 * @param props.isDeleting - Whether a delete request is in flight.
 * @param props.onConfirm - Called when the user confirms deletion.
 * @returns The rendered delete button and dialog.
 */
export function DeleteListingDialog({ disabled, isDeleting, onConfirm }: DeleteListingDialogProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        // eslint-disable-next-line react/forbid-component-props -- fixed size beyond what a NativeWind class expresses on this primitive
        <AlertDialog style={{ height: 56, width: 64 }}>
            <AlertDialogTrigger asChild>
                <Pressable
                    accessibilityLabel={t("common.delete")}
                    accessibilityRole="button"
                    className={cn("items-center justify-center rounded-[10px] bg-destructive", disabled && "opacity-50")}
                    disabled={disabled || isDeleting}
                    style={{ height: "100%", width: "100%" }} // eslint-disable-line react/forbid-component-props -- fills the fixed-size dialog trigger above
                >
                    {isDeleting
                        ? <ActivityIndicator color="white" />
                        : <Icon
                                as={Trash}
                                className="size-6 text-white"
                            />}
                </Pressable>
            </AlertDialogTrigger>

            <AlertDialogContent className="gap-4 rounded-[20px] p-6">
                <AlertDialogHeader className="gap-2">
                    <AlertDialogTitle className="text-left text-[22px] font-noto-bold text-black">
                        {t("listing.deleteTitle")}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-left text-[14px] font-noto-medium text-black">
                        {t("listing.deleteDescription")}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="flex-1 rounded-[10px] border-0 bg-primdesat">
                        <Text className="font-noto-semibold text-black">{t("common.cancel")}</Text>
                    </AlertDialogCancel>

                    <AlertDialogAction
                        className="flex-1 rounded-[10px] bg-destructive"
                        onPress={onConfirm}
                    >
                        <Text className="font-noto-bold text-white">{t("common.delete")}</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
