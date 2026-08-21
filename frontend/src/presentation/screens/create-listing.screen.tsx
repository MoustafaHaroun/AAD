import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Plus } from "lucide-react-native";
import { View, ScrollView, Platform, Pressable, Image } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import { FormField } from "@/presentation/components/primitives/form-field";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { SegmentedControl } from "@/presentation/components/primitives/segmented-control";
import { CategoryPicker } from "@/presentation/components/domain/listings/category-picker";
import { useForm } from "react-hook-form";
import { useCreateApiListing, useUploadListingAttachment, useImageService } from "@/presentation/hooks";
import {
    LISTING_CATEGORIES,
    LISTING_TYPES,
    type ListingCategory,
    type ListingType,
} from "@/domain/entities/listing-category.entity";

const CATEGORY_VALUES = LISTING_CATEGORIES.map(c => c.value) as [ListingCategory, ...ListingCategory[]];
const TYPE_VALUES = LISTING_TYPES.map(t => t.value) as [ListingType, ...ListingType[]];

const createListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
    category: z.enum(CATEGORY_VALUES),
    type: z.enum(TYPE_VALUES),
});

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

/**
 *
 */
export default function CreateListingScreen(): React.JSX.Element {
    const router = useRouter();
    const imageService = useImageService();
    const { mutateAsync: createListing, error } = useCreateApiListing();
    const { mutateAsync: uploadAttachment } = useUploadListingAttachment();
    const { control, handleSubmit, watch, setValue } = useForm<z.infer<typeof createListingSchema>>({
        resolver: zodResolver(createListingSchema),
        defaultValues: { title: "", description: "", type: "offer", category: undefined },
    });

    const [attachments, setAttachments] = useState<string[]>([]);
    const category = watch("category");
    const type = watch("type");

    /**
     *
     */
    async function addAttachment() {
        const uri = await imageService.takePhoto();

        if (uri != null) {
            setAttachments(prev => [...prev, uri]);
        }
    }

    /**
     *
     * @param uri
     */
    function removeAttachment(uri: string) {
        setAttachments(prev => prev.filter(u => u !== uri));
    }

    /**
     *
     * @param data
     */
    async function onSubmit(data: z.infer<typeof createListingSchema>) {
        const listing = await createListing({
            title: data.title,
            description: data.description,
            category: data.category,
            type: data.type,
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
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 bg-background">
                <AppHeader />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <FormField
                            control={control}
                            label="Title"
                            name="title"
                        >
                            {({ value, onChange }) => (<Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />)}
                        </FormField>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">Type</Text>

                            <SegmentedControl
                                onChange={value => { setValue("type", value); }}
                                options={LISTING_TYPES}
                                value={type}
                            />
                        </View>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">Category</Text>

                            <CategoryPicker
                                onChange={value => { setValue("category", value); }}
                                value={category}
                            />
                        </View>

                        <FormField
                            control={control}
                            label="Description"
                            name="description"
                        >
                            {({ value, onChange }) => <Textarea
                                    className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    style={{ height: 191, textAlignVertical: "top" }}
                                    value={value}
                                />}
                        </FormField>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">Photos</Text>

                            <View className="flex-row gap-2">
                                <Pressable
                                    className="h-20 w-20 items-center justify-center rounded-[10px] bg-surfhued"
                                    onPress={addAttachment}
                                >
                                    <View className="size-12 items-center justify-center rounded-full bg-forehued">
                                        <Icon
                                            as={Plus}
                                            className="size-6 text-white"
                                        />
                                    </View>
                                </Pressable>

                                <ScrollView horizontal>
                                    <View className="flex-row gap-2">
                                        {attachments.map(uri => <Pressable key={uri}
onPress={() => removeAttachment(uri)}>
                                                <Image
                                                    className="h-20 w-20 rounded-[10px]"
                                                    resizeMode="cover"
                                                    source={{ uri }}
                                                />
                                             </Pressable>,)}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </ScrollView>

                    <View className="border-t border-border bg-background p-4">
                        <GradientButton
                            disabled={category == null}
                            onPress={handleSubmit(onSubmit)}
                        >
                            Save
                        </GradientButton>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
