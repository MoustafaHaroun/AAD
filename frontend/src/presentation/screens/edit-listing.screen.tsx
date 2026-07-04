import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, ScrollView, Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import { FormField } from "@/presentation/components/primitives/form-field";
import { useForm } from "react-hook-form";
import { useGetApiListing, useUpdateApiListing } from "@/presentation/hooks";

const editListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
});

export default function EditListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { mutateAsync: updateListing } = useUpdateApiListing();
    const { data: listing } = useGetApiListing(id);
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(editListingSchema),
    });

    useEffect(() => {
        if (listing != null) {
            reset({
                title: listing.title,
                description: listing.description ?? "",
            });
        }
    }, [listing, reset]);

    async function onSave(data: z.infer<typeof editListingSchema>): Promise<void> {
        await updateListing({
            id,
            body: {
                title: data.title,
                description: data.description,
            },
        });

        router.back();
    }

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="relative flex flex-col p-4 flex-1"
            >
                <ScrollView className="grow">
                    <FormField
                        control={control}
                        label="Title"
                        name="title"
                    >
                        {({ className, value, onChange }) => (
                            <Input
                                className={className}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    </FormField>

                    <FormField
                        control={control}
                        label="Description"
                        name="description"
                    >
                        {({ className, value, onChange }) => (
                            <Textarea
                                className={className}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    </FormField>
                </ScrollView>

                <Button onPress={handleSubmit(onSave)}>
                    <Text>Save</Text>
                </Button>
            </KeyboardAvoidingView>
        </>
    );
}
