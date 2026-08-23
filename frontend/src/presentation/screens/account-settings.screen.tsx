import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { Platform, Pressable, View } from "react-native";
import { KeyboardAvoidingView, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { FormField } from "@/presentation/components/primitives/form-field";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { UserAvatar } from "@/presentation/components/primitives/user-avatar";
import {
    useCurrentUserId,
    useGetUser,
    useUpdateUser,
    useUploadUserAvatar,
    useRemoveUserAvatar,
    useImageService,
    useNetworkStatus,
} from "@/presentation/hooks";
import { cn } from "@/presentation/utils/cn.util";

/**
 * Build the zod schema for the account settings form, with translated error messages.
 * @param t - The translation function used for validation error messages.
 * @returns The account settings form schema.
 */
// eslint-disable-next-line typescript/explicit-function-return-type
function accountSettingsSchema(t: TFunction) {
    return z.object({
        firstname: z.string().min(1, { message: t("common.errors.required") }).max(128),
        surname: z.string().min(1, { message: t("common.errors.required") }).max(128),
        email: z.email({ message: t("common.errors.invalidEmail") }).min(1, { message: t("common.errors.required") }).max(256),
        location: z.string().min(1, { message: t("common.errors.required") }).max(256),
    });
}

type AccountSettingsFormValues = z.infer<ReturnType<typeof accountSettingsSchema>>;

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

interface AvatarPickerProps {
    readonly avatar?: string | null,
    readonly firstname: string,
    readonly surname: string,
    readonly userId: string,
    readonly isOnline: boolean,
    readonly isUploading: boolean,
    readonly isRemoving: boolean,
    readonly onPress: () => void,
    readonly onRemove: () => void,
}

/**
 * Render the tappable profile-photo circle with an edit badge, upload status, and a remove action.
 * @param props - The props.
 * @param props.avatar - The user's current avatar URI, if set.
 * @param props.firstname - The user's first name, used for the fallback initial.
 * @param props.surname - The user's surname, used for the fallback initial.
 * @param props.userId - The user's id, used to derive a deterministic fallback color.
 * @param props.isOnline - Whether the device has a network connection.
 * @param props.isUploading - Whether an avatar upload is in progress.
 * @param props.isRemoving - Whether an avatar removal is in progress.
 * @param props.onPress - Called when the avatar is pressed, to open the image picker.
 * @param props.onRemove - Called when the remove-photo action is pressed.
 * @returns The rendered avatar picker.
 */
function AvatarPicker({ avatar, firstname, surname, userId, isOnline, isUploading, isRemoving, onPress, onRemove }: AvatarPickerProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="mb-6 items-center">
            <Pressable
                accessibilityLabel={t("common.changeAvatar")}
                accessibilityRole="button"
                className={cn(!isOnline && "opacity-50")}
                disabled={!isOnline}
                onPress={onPress}
            >
                <View className="relative">
                    <UserAvatar
                        avatar={avatar}
                        firstname={firstname}
                        id={userId}
                        size={100}
                        surname={surname}
                    />

                    <View className="absolute bottom-0 right-0 size-8 items-center justify-center rounded-full bg-forehued">
                        <Icon
                            as={Plus}
                            className="size-5 text-white"
                        />
                    </View>
                </View>
            </Pressable>

            {isUploading ? <Text className="mt-2 text-sm text-muted-foreground">{t("account.settings.uploading")}</Text> : null}

            {avatar != null && !isUploading &&
                <Pressable
                    accessibilityLabel={t("common.removePhoto")}
                    accessibilityRole="button"
                    disabled={!isOnline || isRemoving}
                    onPress={onRemove}
                >
                    <Text className={cn("mt-2 text-sm text-destructive", (!isOnline || isRemoving) && "opacity-50")}>
                        {isRemoving ? t("common.removing") : t("common.removePhoto")}
                    </Text>
                </Pressable>}
        </View>
    );
}

/**
 * Provide the avatar upload/remove handlers and their pending state for the given user.
 * @param userId - The signed-in user's id, or null if not yet known.
 * @returns The avatar action handlers and their pending state.
 */
function useAvatarActions(userId: string | null): {
    isUploadingAvatar: boolean,
    isRemovingAvatar: boolean,
    onChangeAvatar: () => void,
    onRemoveAvatar: () => void,
} {
    const imageService = useImageService();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadUserAvatar();
    const { mutateAsync: removeAvatar, isPending: isRemovingAvatar } = useRemoveUserAvatar();

    /**
     * Prompt the user to pick a new avatar image and upload it.
     */
    async function onChangeAvatar(): Promise<void> {
        if (userId == null) {
            return;
        }

        const uri = await imageService.pickImage();

        if (uri != null) {
            await uploadAvatar({ id: userId, file: { uri, name: "avatar.jpg", type: "image/jpeg" } });
        }
    }

    /**
     * Remove the user's current avatar image.
     */
    async function onRemoveAvatar(): Promise<void> {
        if (userId == null) {
            return;
        }

        await removeAvatar({ id: userId });
    }

    return {
        isUploadingAvatar,
        isRemovingAvatar,
        onChangeAvatar: () => { void onChangeAvatar(); },
        onRemoveAvatar: () => { void onRemoveAvatar(); },
    };
}

/**
 * Render the profile settings form and save changes on submit.
 * @returns The rendered account settings screen.
 */
export default function AccountSettingsScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const currentUserId = useCurrentUserId();
    const { data: user } = useGetUser(currentUserId ?? "");
    const { mutateAsync: updateUser, isPending: isSaving, error } = useUpdateUser();
    const { isUploadingAvatar, isRemovingAvatar, onChangeAvatar, onRemoveAvatar } = useAvatarActions(currentUserId);
    const isOnline = useNetworkStatus();
    const schema = useMemo(() => accountSettingsSchema(t), [t]);
    const { control, handleSubmit, reset } = useForm<AccountSettingsFormValues>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (user != null) {
            reset({
                firstname: user.firstname,
                surname: user.surname,
                email: user.email,
                location: user.location ?? "",
            });
        }
    }, [user, reset]);

    /**
     * Save the profile changes and return to the previous screen.
     * @param data - The validated profile field values.
     */
    async function onSave(data: AccountSettingsFormValues): Promise<void> {
        if (currentUserId == null) {
            return;
        }

        await updateUser({ id: currentUserId, body: data });
        router.back();
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-background">
                <AppHeader />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <KeyboardAwareScrollView contentContainerStyle={{ padding: 16 }}>
                        {user != null &&
                            <AvatarPicker
                                avatar={user.avatar}
                                firstname={user.firstname}
                                isOnline={isOnline}
                                isRemoving={isRemovingAvatar}
                                isUploading={isUploadingAvatar}
                                onPress={onChangeAvatar}
                                onRemove={onRemoveAvatar}
                                surname={user.surname}
                                userId={user.id}
                            />}

                        <FormField
                            control={control}
                            label={t("account.settings.firstnameLabel")}
                            name="firstname"
                        >
                            {({ value, onChange }) => <Input
                                className={INPUT_CLASS}
                                onChangeText={onChange}
                                value={value}
                            />}
                        </FormField>

                        <FormField
                            control={control}
                            label={t("account.settings.surnameLabel")}
                            name="surname"
                        >
                            {({ value, onChange }) => <Input
                                className={INPUT_CLASS}
                                onChangeText={onChange}
                                value={value}
                            />}
                        </FormField>

                        <FormField
                            control={control}
                            label={t("account.settings.emailLabel")}
                            name="email"
                        >
                            {({ value, onChange }) => <Input
                                autoCapitalize="none"
                                className={INPUT_CLASS}
                                keyboardType="email-address"
                                onChangeText={onChange}
                                value={value}
                            />}
                        </FormField>

                        <FormField
                            control={control}
                            label={t("account.settings.locationLabel")}
                            name="location"
                        >
                            {({ value, onChange }) => <Input
                                className={INPUT_CLASS}
                                onChangeText={onChange}
                                value={value}
                            />}
                        </FormField>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </KeyboardAwareScrollView>

                    <View className="border-t border-border bg-background p-4">
                        <GradientButton
                            disabled={isSaving || !isOnline}
                            onPress={() => { void handleSubmit(onSave)(); }}
                        >
                            {isSaving ? t("common.saving") : t("common.save")}
                        </GradientButton>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
