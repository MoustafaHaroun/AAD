import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Plus } from "lucide-react-native";
import { View, ScrollView, Platform, Pressable, Image } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SCREEN_OPTIONS } from "@/presentation/styles/screen-options";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Button } from "@/presentation/components/primitives/rnreusables/ui/button";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import { Label } from "@/presentation/components/primitives/rnreusables/ui/label";
import { FormField } from "@/presentation/components/primitives/form-field";
import { useForm } from "react-hook-form";
import {
    useGetListingsByUser,
    useCreateListing,
    useImageService,
} from "@/presentation/hooks";

const createListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
    attachments: z.array(z.string()).min(1),
});

/**
 * Render the CreateListingScreen component.
 * @returns The CreateListingScreen component.
 */
export default function CreateListingScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const { mutate } = useCreateListing();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(createListingSchema),
    });

    const [attachments, setAttachments] = useState([]);

    /**
     *
     * @param onChange
     */
    async function addAttachment(onChange: (value: string[]) => void) {
        const uri = await imageService.takePhoto();

        if (uri != null) {
            setAttachments(prev => {
                const next = [...prev, uri];

                onChange(next);
                return next;
            });
        }
    }

    /**
     *
     * @param uri
     */
    function removeAttachment(uri: string) {
        setAttachments(prev => {
            const next = prev.filter(u => u !== uri);

            onChange(next);
            return next;
        });
    }

    /**
     *
     * @param data
     */
    function onSubmit(data) {
        mutate({
            userId: "Tim Timmerman",
            listing: {
                id: Date.now(),
                title: data.title,
                description: data.description,
                location: "Houten",
                user: "Tim Timmerman",
                attachments,
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
                        {({ onChange }) => (<View className="flex flex-row gap-2">
                                <Pressable
                                    className="flex items-center justify-center bg-muted rounded-md h-16 w-16"
                                    onPress={async () => addAttachment(onChange)}
                                >
                                    <Icon
className="size-5"
                                        as={Plus}
                                    />
                                </Pressable>

                                <ScrollView horizontal>
                    <View className="flex flex-row gap-2">
                                        {attachments
? attachments.map(uri => 
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
                            </View>)}
                    </FormField>
                </ScrollView>

                <Button onPress={handleSubmit(onSubmit)}>
                    <Text>Submit</Text>
                </Button>
            </KeyboardAvoidingView>
        </>
    );
}
