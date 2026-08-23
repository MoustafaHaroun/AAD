import React, { useMemo, useState } from "react";
import { Image, View, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { SecondaryButton } from "@/presentation/components/primitives/secondary-button";
import { CredentialsStep } from "@/presentation/components/domain/register/credentials-step";
import { NamesStep } from "@/presentation/components/domain/register/names-step";
import { AddressStep } from "@/presentation/components/domain/register/address-step";
import { PfpStep } from "@/presentation/components/domain/register/pfp-step";
import {
    createRegisterSchema,
    REGISTER_STEPS,
    REGISTER_STEP_FIELDS,
    type RegisterFormValues,
    type RegisterStep,
} from "@/presentation/components/domain/register/schema";
import { useCreateUser, useSignIn, useUploadUserAvatar, useImageService } from "@/presentation/hooks";

interface RegisterStepContentProps {
    readonly step: RegisterStep,
    readonly control: Control<RegisterFormValues>,
    readonly avatarUri: string | null,
    readonly onPickAvatar: () => void,
}

/**
 * Render the registration wizard's current step content.
 * @param props - The props.
 * @param props.step - The active wizard step.
 * @param props.control - The react-hook-form control shared across all steps.
 * @param props.avatarUri - The locally picked avatar image URI, for the "pfp" step.
 * @param props.onPickAvatar - Called when the avatar circle is pressed, for the "pfp" step.
 * @returns The rendered step content.
 */
function RegisterStepContent({ step, control, avatarUri, onPickAvatar }: RegisterStepContentProps): React.JSX.Element {
    switch (step) {
        case "credentials":
            return <CredentialsStep control={control} />;
        case "names":
            return <NamesStep control={control} />;
        case "address":
            return <AddressStep control={control} />;
        default:
            return <PfpStep
                avatarUri={avatarUri}
                onPick={onPickAvatar}
            />;
    }
}

interface RegisterStepActionsProps {
    readonly isLastStep: boolean,
    readonly isPending: boolean,
    readonly onBack: () => void,
    readonly onNext: () => void,
    readonly onSubmit: () => void,
}

/**
 * Render the registration wizard's back/continue (or back/create-account) button row.
 * @param props - The props.
 * @param props.isLastStep - Whether the current step is the final "pfp" step.
 * @param props.isPending - Whether account creation is in flight.
 * @param props.onBack - Called when the back button is pressed.
 * @param props.onNext - Called when the continue button is pressed, on a non-final step.
 * @param props.onSubmit - Called when the create-account button is pressed, on the final step.
 * @returns The rendered button row.
 */
function RegisterStepActions({ isLastStep, isPending, onBack, onNext, onSubmit }: RegisterStepActionsProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="mt-6 flex-row gap-3">
            <SecondaryButton
                className="flex-1"
                onPress={onBack}
            >
                {t("common.back")}
            </SecondaryButton>

            {isLastStep
                ? <GradientButton
                        className="flex-1"
                        disabled={isPending}
                        onPress={onSubmit}
                    >
                        {isPending ? t("register.creatingAccount") : t("register.continue")}
                    </GradientButton>

                : <GradientButton
                        className="flex-1"
                        onPress={onNext}
                    >
                        {t("register.continue")}
                    </GradientButton>}
        </View>
    );
}

/**
 * Render the multi-step registration wizard and create the account on the final step.
 * @returns The rendered registration screen.
 */
export default function RegisterScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const imageService = useImageService();
    const { mutateAsync: createUser, isPending: isCreating, error } = useCreateUser();
    const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadUserAvatar();
    const [stepIndex, setStepIndex] = useState(0);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const registerSchema = useMemo(() => createRegisterSchema(t), [t]);
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
     * Validate the current step's fields and advance to the next step if they pass.
     */
    async function goNext(): Promise<void> {
        const valid = await trigger(REGISTER_STEP_FIELDS[step]);

        if (valid) {
            setStepIndex(prev => prev + 1);
        }
    }

    /**
     * Go back to the previous step, or leave the wizard entirely on the first step.
     */
    function goBack(): void {
        if (stepIndex === 0) {
            router.back();
        } else {
            setStepIndex(prev => prev - 1);
        }
    }

    /**
     * Prompt the user to pick an avatar image and store its local URI.
     */
    async function pickAvatar(): Promise<void> {
        const uri = await imageService.pickImage();

        if (uri != null) {
            setAvatarUri(uri);
        }
    }

    /**
     * Create the account, sign in, upload the avatar if one was picked, and navigate home.
     * @param data - The validated registration form values.
     */
    async function onSubmit(data: RegisterFormValues): Promise<void> {
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
                    <KeyboardAwareScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="items-center">
                            <Image
                                className="size-[163px] rounded-[24px]"
                                source={require("@/assets/images/logo.png") as number}
                            />

                            <Text className="mt-6 text-[40px] font-noto-bold text-black">Trade²</Text>
                        </View>

                        <View className="mt-10 flex-1">
                            <RegisterStepContent
                                avatarUri={avatarUri}
                                control={control}
                                onPickAvatar={() => { void pickAvatar(); }}
                                step={step}
                            />

                            {error != null &&
                                <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                        </View>

                        <RegisterStepActions
                            isLastStep={step === "pfp"}
                            isPending={isPending}
                            onBack={goBack}
                            onNext={() => { void goNext(); }}
                            onSubmit={() => { void handleSubmit(onSubmit)(); }}
                        />

                        <Text
                            className="mt-6 text-center text-[16px] font-noto-medium text-forehued"
                            onPress={() => { router.replace("/login"); }}
                        >
                            {t("register.haveAccountPrefix")}

                            <Text className="font-noto-bold text-black">{t("register.here")}</Text>

                            {t("register.haveAccountSuffix")}
                        </Text>
                    </KeyboardAwareScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
