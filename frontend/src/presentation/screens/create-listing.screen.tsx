import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { useCreateApiListing, useUploadListingAttachment, useImageService, useNetworkStatus, useListingDraft } from "@/presentation/hooks";
import {
    LISTING_CATEGORIES,
    LISTING_TYPES,
    type ListingCategory,
    type ListingType,
} from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

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
 * Render the create-listing form, restoring any saved draft and publishing on submit.
 * @returns The rendered create-listing screen.
 */
export default function CreateListingScreen(): React.JSX.Element {
    const router = useRouter();
    const { t } = useTranslation();
    const imageService = useImageService();
    const { mutateAsync: createListing, error } = useCreateApiListing();
    const { mutateAsync: uploadAttachment } = useUploadListingAttachment();
    const isOnline = useNetworkStatus();
    const { draft, draftLoaded, saveDraft, clearDraft } = useListingDraft("new");
    const { control, handleSubmit, watch, setValue, reset } = useForm<z.infer<typeof createListingSchema>>({
        resolver: zodResolver(createListingSchema),
        defaultValues: { title: "", description: "", type: "offer", category: undefined },
    });

    const [attachments, setAttachments] = useState<string[]>([]);
    const category = watch("category");
    const type = watch("type");
    const typeOptions = LISTING_TYPES.map(option => ({ value: option.value, label: t(`listingType.${option.value}`) }));

    useEffect(() => {
        if (draftLoaded && draft != null) {
            reset({
                title: draft.title ?? "",
                description: draft.description ?? "",
                type: (draft.type as ListingType | undefined) ?? "offer",
                category: draft.category as ListingCategory | undefined,
            });
        }
    }, [draftLoaded]);

    useEffect(() => {
        const subscription = watch(values => {
            saveDraft({ title: values.title, description: values.description, category: values.category, type: values.type });
        });

        return () => { subscription.unsubscribe(); };
    }, [watch]);

    /**
     * Pick or capture a photo and add it to the attachments to upload on submit.
     */
    async function addAttachment(): Promise<void> {
        const uri = await imageService.pickImage();

        if (uri != null) {
            setAttachments(prev => [...prev, uri]);
        }
    }

    /**
     * Remove a photo from the attachments to upload on submit.
     * @param uri - The local URI of the attachment to remove.
     */
    function removeAttachment(uri: string): void {
        setAttachments(prev => prev.filter(u => u !== uri));
    }

    /**
     * Create the listing, upload any attached photos, clear the draft, and go back.
     * @param data - The validated listing field values.
     */
    async function onSubmit(data: z.infer<typeof createListingSchema>): Promise<void> {
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

        clearDraft();
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
                            label={t("listingForm.titleLabel")}
                            name="title"
                        >
                            {({ value, onChange }) => (<Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />)}
                        </FormField>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.typeLabel")}</Text>

                            <SegmentedControl
                                onChange={value => { setValue("type", value); }}
                                options={typeOptions}
                                value={type}
                            />
                        </View>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.categoryLabel")}</Text>

                            <CategoryPicker
                                onChange={value => { setValue("category", value); }}
                                value={category}
                            />
                        </View>

                        <FormField
                            control={control}
                            label={t("listingForm.descriptionLabel")}
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
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.photosLabel")}</Text>

                            <View className="flex-row gap-2">
                                <Pressable
                                    accessibilityLabel={t("common.addPhoto")}
                                    accessibilityRole="button"
                                    className={cn("h-20 w-20 items-center justify-center rounded-[10px] bg-surfhued", !isOnline && "opacity-50")}
                                    disabled={!isOnline}
                                    onPress={() => { void addAttachment(); }}
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
                                        {attachments.map(uri => <Pressable
accessibilityLabel={t("common.removePhoto")}
accessibilityRole="button"
key={uri}
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
                            disabled={category == null || !isOnline}
                            onPress={() => { void handleSubmit(onSubmit)(); }}
                        >
                            {t("common.save")}
                        </GradientButton>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
