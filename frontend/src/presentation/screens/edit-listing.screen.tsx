import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react-native";
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
import {
    useGetApiListing,
    useUpdateApiListing,
    useUploadListingAttachment,
    useRemoveListingAttachment,
    useImageService,
} from "@/presentation/hooks";
import {
    LISTING_CATEGORIES,
    LISTING_TYPES,
    type ListingCategory,
    type ListingType,
} from "@/domain/entities/listing-category.entity";

const CATEGORY_VALUES = LISTING_CATEGORIES.map(c => c.value) as [ListingCategory, ...ListingCategory[]];
const TYPE_VALUES = LISTING_TYPES.map(t => t.value) as [ListingType, ...ListingType[]];

const editListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
    category: z.enum(CATEGORY_VALUES),
    type: z.enum(TYPE_VALUES),
});

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

/**
 *
 */
export default function EditListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const imageService = useImageService();
    const { mutateAsync: updateListing, error } = useUpdateApiListing();
    const { mutateAsync: uploadAttachment } = useUploadListingAttachment();
    const { mutateAsync: removeAttachment } = useRemoveListingAttachment();
    const { data: listing } = useGetApiListing(id);
    const { control, handleSubmit, reset, watch, setValue } = useForm<z.infer<typeof editListingSchema>>({
        resolver: zodResolver(editListingSchema),
    });

    const [newAttachments, setNewAttachments] = useState<string[]>([]);
    const category = watch("category");
    const type = watch("type");

    useEffect(() => {
        if (listing != null) {
            reset({
                title: listing.title,
                description: listing.description ?? "",
                category: listing.category,
                type: listing.type,
            });
        }
    }, [listing, reset]);

    /**
     *
     */
    async function addAttachment() {
        const uri = await imageService.takePhoto();

        if (uri != null) {
            setNewAttachments(prev => [...prev, uri]);
        }
    }

    /**
     *
     * @param uri
     */
    function removeNewAttachment(uri: string) {
        setNewAttachments(prev => prev.filter(u => u !== uri));
    }

    /**
     *
     * @param data
     */
    async function onSave(data: z.infer<typeof editListingSchema>): Promise<void> {
        await updateListing({
            id,
            body: {
                title: data.title,
                description: data.description,
                category: data.category,
                type: data.type,
            },
        });

        if (newAttachments.length > 0) {
            await uploadAttachment({
                id,
                files: newAttachments.map((uri, index) => ({
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

                            {type != null &&
                                <SegmentedControl
                                    onChange={value => { setValue("type", value); }}
                                    options={LISTING_TYPES}
                                    value={type}
                                />}
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

                            <ScrollView horizontal>
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

                                    {listing?.attachments?.map(attachment => <View className="relative"
key={attachment.id}>
                                            <Image
                                                className="h-20 w-20 rounded-[10px]"
                                                resizeMode="cover"
                                                source={{ uri: attachment.path }}
                                            />

                                            <Pressable
                                                className="absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-forehued"
                                                onPress={async () => removeAttachment({ id, attachmentId: attachment.id })}
                                            >
                                                <Icon as={X}
className="size-3 text-white" />
                                            </Pressable>
                                         </View>,)}

                                    {newAttachments.map(uri => <Pressable key={uri}
onPress={() => removeNewAttachment(uri)}>
                                            <Image
                                                className="h-20 w-20 rounded-[10px]"
                                                resizeMode="cover"
                                                source={{ uri }}
                                            />
                                         </Pressable>,)}
                                </View>
                            </ScrollView>
                        </View>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </ScrollView>

                    <View className="border-t border-border bg-background p-4">
                        <GradientButton
                            disabled={listing == null}
                            onPress={handleSubmit(onSave)}
                        >
                            Save
                        </GradientButton>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
