import React, { useState } from "react";
import { Image, View, ScrollView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { SecondaryButton } from "@/presentation/components/primitives/secondary-button";
import { CredentialsStep } from "@/presentation/components/domain/register/credentials-step";
import { NamesStep } from "@/presentation/components/domain/register/names-step";
import { AddressStep } from "@/presentation/components/domain/register/address-step";
import { PfpStep } from "@/presentation/components/domain/register/pfp-step";
import {
    registerSchema,
    REGISTER_STEPS,
    REGISTER_STEP_FIELDS,
    type RegisterFormValues,
} from "@/presentation/components/domain/register/schema";
import { useCreateUser, useSignIn, useUploadUserAvatar, useImageService } from "@/presentation/hooks";

/**
 *
 */
export default function RegisterScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const { mutateAsync: createUser, isPending: isCreating, error } = useCreateUser();
    const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadUserAvatar();
    const [stepIndex, setStepIndex] = useState(0);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const { control, handleSubmit, trigger } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            surname: "",
            country: "",
            region: "",
            city: "",
            postalCode: "",
            street: "",
        },
    });

    const step = REGISTER_STEPS[stepIndex];
    const isPending = isCreating || isSigningIn || isUploadingAvatar;

    /**
     *
     */
    async function goNext() {
        const valid = await trigger(REGISTER_STEP_FIELDS[step]);

        if (valid) {
            setStepIndex(prev => prev + 1);
        }
    }

    /**
     *
     */
    function goBack() {
        if (stepIndex === 0) {
            router.back();
        } else {
            setStepIndex(prev => prev - 1);
        }
    }

    /**
     *
     */
    async function pickAvatar() {
        const uri = await imageService.pickImageFromGallery();

        if (uri != null) {
            setAvatarUri(uri);
        }
    }

    /**
     *
     * @param data
     */
    async function onSubmit(data: RegisterFormValues) {
        const location = [data.street, data.city, data.postalCode, data.region, data.country]
            .filter(Boolean)
            .join(", ");

        const user = await createUser({
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            surname: data.surname,
            location,
        });

        // Sign in immediately so the avatar upload (which requires auth) can succeed.
        await signIn({ email: data.email, password: data.password });

        if (avatarUri != null) {
            await uploadAvatar({
                id: user.id,
                file: { uri: avatarUri, name: "avatar.jpg", type: "image/jpeg" },
            });
        }

        router.replace("/home");
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView
                className="flex-1 bg-background"
                edges={["bottom", "top"]}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="items-center">
                            <Image
                                className="size-[163px] rounded-[24px]"
                                source={require("@/assets/images/logo.png")}
                            />

                            <Text className="mt-6 text-[40px] font-noto-bold text-black">Trade²</Text>
                        </View>

                        <View className="mt-10 flex-1">
                            {step === "credentials" && <CredentialsStep control={control} />}

                            {step === "names" && <NamesStep control={control} />}

                            {step === "address" && <AddressStep control={control} />}

                            {step === "pfp" && <PfpStep
                                avatarUri={avatarUri}
                                onPick={pickAvatar}
                            />}

                            {error != null &&
                                <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                        </View>

                        <View className="mt-6 flex-row gap-3">
                            <SecondaryButton
                                className="flex-1"
                                onPress={goBack}
                            >
                                Back
                            </SecondaryButton>

                            {step === "pfp"
                                ? <GradientButton
                                        className="flex-1"
                                        disabled={isPending}
                                        onPress={handleSubmit(onSubmit)}
                                    >
                                    {isPending ? "Creating account…" : "Continue"}
                                  </GradientButton>

                                : <GradientButton
                                        className="flex-1"
                                        onPress={goNext}
                                    >
                                    Continue
                                    </GradientButton>}
                        </View>

                        <Text
                            className="mt-6 text-center text-[16px] font-noto-medium text-forehued"
                            onPress={() => { router.replace("/login"); }}
                        >
                            Already have an account? Click{" "}

                            <Text className="font-noto-bold text-black">here</Text>

                            {" "}to login.
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
