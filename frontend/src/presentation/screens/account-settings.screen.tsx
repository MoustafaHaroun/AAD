import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { useEffect } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react-native";
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
    useImageService,
} from "@/presentation/hooks";

const accountSettingsSchema = z.object({
    firstname: z.string().min(1).max(128),
    surname: z.string().min(1).max(128),
    email: z.string().min(1).max(256)
        .email(),
    location: z.string().min(1).max(256),
});

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

/**
 *
 */
export default function AccountSettingsScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const currentUserId = useCurrentUserId();
    const { data: user } = useGetUser(currentUserId ?? "");
    const { mutateAsync: updateUser, isPending: isSaving, error } = useUpdateUser();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadUserAvatar();
    const { control, handleSubmit, reset } = useForm<z.infer<typeof accountSettingsSchema>>({
        resolver: zodResolver(accountSettingsSchema),
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
     *
     */
    async function onChangeAvatar() {
        if (currentUserId == null) { return; }

        const uri = await imageService.pickImageFromGallery();

        if (uri != null) {
            await uploadAvatar({ id: currentUserId, file: { uri, name: "avatar.jpg", type: "image/jpeg" } });
        }
    }

    /**
     *
     * @param data
     */
    async function onSave(data: z.infer<typeof accountSettingsSchema>) {
        if (currentUserId == null) { return; }

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
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        {user != null &&
                            <Pressable
                                className="mb-6 items-center"
                                onPress={onChangeAvatar}
                            >
                                <View className="relative">
                                    <UserAvatar
                                        avatar={user.avatar}
                                        firstname={user.firstname}
                                        id={user.id}
                                        size={100}
                                        surname={user.surname}
                                    />

                                    <View className="absolute bottom-0 right-0 size-8 items-center justify-center rounded-full bg-forehued">
                                        <Icon
                                            as={Plus}
                                            className="size-5 text-white"
                                        />
                                    </View>
                                </View>

                                {isUploadingAvatar ? <Text className="mt-2 text-sm text-muted-foreground">Uploading…</Text> : null}
                            </Pressable>}

                        <FormField
                            control={control}
                            label="Firstname"
                            name="firstname"
                        >
                            {({ value, onChange }) => (<Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />)}
                        </FormField>

                        <FormField
                            control={control}
                            label="Surname"
                            name="surname"
                        >
                            {({ value, onChange }) => (<Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />)}
                        </FormField>

                        <FormField
                            control={control}
                            label="Email address"
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
                            label="Location"
                            name="location"
                        >
                            {({ value, onChange }) => (<Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />)}
                        </FormField>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </ScrollView>

                    <View className="border-t border-border bg-background p-4">
                        <GradientButton
                            disabled={isSaving}
                            onPress={handleSubmit(onSave)}
                        >
                            {isSaving ? "Saving…" : "Save"}
                        </GradientButton>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
