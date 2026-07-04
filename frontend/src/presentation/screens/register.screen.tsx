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
import { useCreateUser } from "@/presentation/hooks";

const registerSchema = z.object({
    firstname: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});

export default function RegisterScreen(): React.JSX.Element {
    const router = useRouter();
    const { mutate: createUser, isPending, error } = useCreateUser();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { firstname: "", surname: "", email: "", password: "" },
    });

    function onSubmit(data: z.infer<typeof registerSchema>) {
        createUser(
            { email: data.email, password: data.password, firstname: data.firstname, surname: data.surname },
            { onSuccess: () => router.replace("/login") },
        );
    }

    return (
        <>
            <Stack.Screen options={{ ...SCREEN_OPTIONS, title: "Register" }} />

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
                            <Text className="text-2xl font-bold">Create account</Text>
                            <Text className="text-muted-foreground mt-1">Fill in your details to get started</Text>
                        </View>

                        <View className="flex flex-row gap-3">
                            <View className="flex-1">
                                <FormField control={control} label="First name" name="firstname">
                                    {({ className, value, onChange }) => (
                                        <Input
                                            className={className}
                                            value={value}
                                            onChangeText={onChange}
                                            autoComplete="given-name"
                                        />
                                    )}
                                </FormField>
                            </View>

                            <View className="flex-1">
                                <FormField control={control} label="Surname" name="surname">
                                    {({ className, value, onChange }) => (
                                        <Input
                                            className={className}
                                            value={value}
                                            onChangeText={onChange}
                                            autoComplete="family-name"
                                        />
                                    )}
                                </FormField>
                            </View>
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
                                    autoComplete="new-password"
                                />
                            )}
                        </FormField>

                        {error != null && (
                            <Text className="text-destructive text-sm mb-4">{error.message}</Text>
                        )}

                        <View className="flex flex-col gap-3 mt-2">
                            <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
                                <Text>{isPending ? "Creating account…" : "Create account"}</Text>
                            </Button>

                            <Button variant="ghost" onPress={() => router.back()}>
                                <Text className="text-muted-foreground text-sm">
                                    Already have an account?{" "}
                                    <Text className="font-semibold text-foreground text-sm">Sign in</Text>
                                </Text>
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}
