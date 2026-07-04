import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { useSignIn } from "@/presentation/hooks";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export default function LoginScreen(): React.JSX.Element {
    const router = useRouter();
    const { mutate: signIn, isPending, error } = useSignIn();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        signIn(
            { email: data.email, password: data.password },
            { onSuccess: () => router.replace("/") },
        );
    }

    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, title: "Sign in", headerBackVisible: false }} />

            <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 24 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="mb-6">
                            <Text className="text-2xl font-bold">Welcome back</Text>
                            <Text className="text-muted-foreground mt-1">Sign in to your account</Text>
                        </View>

                        <FormField control={control} label="Email" name="email">
                            {({ className, value, onChange }) => (
                                <Input
                                    className={className}
                                    value={value}
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            )}
                        </FormField>

                        <FormField control={control} label="Password" name="password">
                            {({ className, value, onChange }) => (
                                <Input
                                    className={className}
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry
                                    autoComplete="password"
                                />
                            )}
                        </FormField>

                        {error != null && (
                            <Text className="text-destructive text-sm mb-4">{error.message}</Text>
                        )}

                        <View className="flex flex-col gap-3 mt-2">
                            <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
                                <Text>{isPending ? "Signing in…" : "Sign in"}</Text>
                            </Button>

                            <Button variant="ghost" onPress={() => router.push("/register")}>
                                <Text className="text-muted-foreground text-sm">
                                    Don't have an account?{" "}
                                    <Text className="font-semibold text-foreground text-sm">Register</Text>
                                </Text>
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
