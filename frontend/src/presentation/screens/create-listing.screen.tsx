import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React, { useState } from "react";
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
import { useCreateApiListing, useUploadListingAttachment, useImageService } from "@/presentation/hooks";

const createListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
});

export default function CreateListingScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const { mutateAsync: createListing } = useCreateApiListing();
    const { mutateAsync: uploadAttachment } = useUploadListingAttachment();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(createListingSchema),
    });

    const [attachments, setAttachments] = useState<string[]>([]);

    async function addAttachment() {
        const uri = await imageService.takePhoto();
        if (uri != null) {
            setAttachments(prev => [...prev, uri]);
        }
    }

    function removeAttachment(uri: string) {
        setAttachments(prev => prev.filter(u => u !== uri));
    }

    async function onSubmit(data: z.infer<typeof createListingSchema>) {
        const listing = await createListing({
            title: data.title,
            description: data.description,
        });

        if (attachments.length > 0) {
            await uploadAttachment({
                id: listing.id,
                files: attachments.map((uri, index) => ({
                    uri,
                    name: `attachment_${index}.jpg`,
                    type: "image/jpeg",
                })),
            });
        }

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

                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="font-medium">Attachments</Text>
                        <View className="flex flex-row gap-2">
                            <Pressable
                                className="flex items-center justify-center bg-muted rounded-md h-16 w-16"
                                onPress={addAttachment}
                            >
                                <Icon className="size-5" as={Plus} />
                            </Pressable>

                            <ScrollView horizontal>
                                <View className="flex flex-row gap-2">
                                    {attachments.map(uri => (
                                        <Pressable key={uri} onPress={() => removeAttachment(uri)}>
                                            <Image
                                                className="h-16 w-16 rounded-md"
                                                source={{ uri }}
                                                resizeMode="cover"
                                            />
                                        </Pressable>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>

                <Button onPress={handleSubmit(onSubmit)}>
                    <Text>Submit</Text>
                </Button>
            </KeyboardAvoidingView>
        </>
    );
}
