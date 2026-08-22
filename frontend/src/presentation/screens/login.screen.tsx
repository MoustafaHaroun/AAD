import React from "react";
import { Image, View, ScrollView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { PasswordInput } from "@/presentation/components/primitives/password-input";
import { useSignIn } from "@/presentation/hooks";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

export default function LoginScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const { mutate: signIn, isPending, error } = useSignIn();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        signIn(
            { email: data.email, password: data.password },
            { onSuccess: () => { router.replace("/home"); } },
        );
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
                        contentContainerStyle={{ padding: 24 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="items-center">
                            <Image
                                className="size-[163px] rounded-[24px]"
                                source={require("@/assets/images/logo.png")}
                            />

                            <Text className="mt-6 text-[40px] font-noto-bold text-black">Trade²</Text>
                        </View>

                        <View className="mt-10">
                            <FormField
                                control={control}
                                label={t("login.emailLabel")}
                                name="email"
                            >
                                {({ value, onChange }) => (<Input
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        className={INPUT_CLASS}
                                        keyboardType="email-address"
                                        onChangeText={onChange}
                                        placeholder={t("login.emailPlaceholder")}
                                        value={value}
                                    />)}
                            </FormField>

                            <FormField
                                control={control}
                                label={t("login.passwordLabel")}
                                name="password"
                            >
                                {({ value, onChange }) => (<PasswordInput
                                        autoComplete="password"
                                        className={INPUT_CLASS}
                                        onChangeText={onChange}
                                        value={value}
                                    />)}
                            </FormField>
                        </View>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}

                        <View className="mt-4 gap-3">
                            <GradientButton
                                disabled={isPending}
                                onPress={handleSubmit(onSubmit)}
                            >
                                {isPending ? t("login.submitting") : t("login.submit")}
                            </GradientButton>
                        </View>

                        <Text
                            className="mt-6 text-center text-[16px] font-noto-medium text-forehued"
                            onPress={() => { router.push("/register"); }}
                        >
                            {t("login.noAccountPrefix")}

                            <Text className="font-noto-bold text-black">{t("login.here")}</Text>

                            {t("login.noAccountSuffix")}
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
