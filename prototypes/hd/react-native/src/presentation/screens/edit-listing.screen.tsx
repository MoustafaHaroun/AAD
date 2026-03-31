import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Plus } from "lucide-react-native";
import { View, ScrollView, Platform, Pressable, Image } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import { FormField } from "@/presentation/components/primitives/form-field";
import { useForm } from "react-hook-form";
import {
    useEditListing, useGetListingById,
    useImageService,
} from "@/presentation/hooks";

const editListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
    attachments: z.array(z.string()).min(1),
});

/**
 * Render the EditListingScreen component.
 * @returns The EditListingScreen component.
 */
export default function EditListingScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { mutate } = useEditListing();
    const { data: listing } = useGetListingById(id);
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(editListingSchema),
    });

    useEffect(() => {
        if (listing != null) {
            reset({
                title: listing.title,
                description: listing.description ?? "",
                attachments: listing.attachments,
            });
        }
    }, [listing, reset]);

    async function addAttachment(
        current: string[],
        onChange: (value: string[]) => void
    ): Promise<void> {
        const uri = await imageService.takePhoto();

        if (uri != null) {
            onChange([...current, uri]);
        }
    }

    function removeAttachment(
        uri: string,
        current: string[],
        onChange: (value: string[]) => void
    ): void {
        onChange(current.filter(u => u !== uri));
    }

    /**
     * Safe the data.
     * @param data - The data to save.
     */
    function onSave(data: z.infer<typeof editListingSchema>): void {
        mutate({
            userId: "Tim Timmerman",
            listing: {
                ...listing,
                title: data.title,
                description: data.description ?? null,
                attachments: data.attachments,
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
                        {({ className, value, onChange }) => (<Input
                            className={className}
                            onChangeText={onChange}
                            value={value}
                        />)}
                    </FormField>

                    <FormField
                        control={control}
                        label="Description"
                        name="description"
                    >
                        {({ className, value, onChange }) => (<Textarea
                            className={className}
                            onChangeText={onChange}
                            value={value}
                        />)}
                    </FormField>

                    <FormField
                        control={control}
                        label="Attachments"
                        name="attachments"
                    >
                        {({ onChange, value }) => (
                            <View className="flex flex-row gap-2">
                                <Pressable
                                    className="flex items-center justify-center bg-muted rounded-md h-16 w-16"
                                    onPress={async () => addAttachment(value, onChange)}
                                >
                                    <Icon
                                        className="size-5"
                                        as={Plus}
                                    />
                                </Pressable>

                                <ScrollView horizontal>
                                    <View className="flex flex-row gap-2">
                                        {value
                                            ? value.map(uri =>
                                                <Image
                                                    className="h-16 w-16 rounded-md"
                                                    key={uri}
                                                    source={{ uri }}
                                                    resizeMode="cover"
                                                />
                                            )
                                            : null}
                                    </View>
                                </ScrollView>
                            </View>)
                        }
                    </FormField>
                </ScrollView>

                <Button onPress={handleSubmit(onSave)}>
                    <Text>Save</Text>
                </Button>
            </KeyboardAvoidingView>
        </>
    );
}
