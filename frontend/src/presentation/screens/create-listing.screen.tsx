import { useRouter, Stack } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { KeyboardAvoidingView, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { ListingBasicFields } from "@/presentation/components/domain/listings/listing-basic-fields";
import { AddPhotoButton, TapToRemoveThumbnail } from "@/presentation/components/domain/listings/listing-photo-field";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateApiListing, useUploadListingAttachment, useImageService, useNetworkStatus, useListingDraft } from "@/presentation/hooks";
import { LISTING_TYPES, type ListingCategory, type ListingType } from "@/domain/entities/listing-category.entity";
import { createListingFormSchema, type ListingFormValues } from "@/presentation/schemas/listing-form.schema";

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
    const schema = useMemo(() => createListingFormSchema(t), [t]);
    const { control, handleSubmit, watch, setValue, reset } = useForm<ListingFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { title: "", description: "", type: "offer", category: undefined },
    });

    const [attachments, setAttachments] = useState<string[]>([]);
    const category = watch("category");
    // eslint-disable-next-line typescript/no-unnecessary-condition
    const hasCategory = category != null;
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

        return () => {
            subscription.unsubscribe();
        };
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
     * Create the listing, upload any attached photos, clear the draft, and open the new listing.
     * @param data - The validated listing field values.
     */
    async function onSubmit(data: ListingFormValues): Promise<void> {
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
        router.replace(`/listings/${listing.id}`);
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
                    <KeyboardAwareScrollView contentContainerStyle={{ padding: 16 }}>
                        <ListingBasicFields
                            category={category}
                            control={control}
                            descriptionField="description"
                            onChangeCategory={value => { setValue("category", value); }}
                            onChangeType={value => { setValue("type", value); }}
                            titleField="title"
                            type={type}
                            typeOptions={typeOptions}
                        />

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.photosLabel")}</Text>

                            <View className="flex-row gap-2">
                                <AddPhotoButton
                                    isOnline={isOnline}
                                    onPress={() => { void addAttachment(); }}
                                />

                                <ScrollView horizontal>
                                    <View className="flex-row gap-2">
                                        {attachments.map(uri => <TapToRemoveThumbnail
                                            key={uri}
                                            onRemove={() => { removeAttachment(uri); }}
                                            uri={uri}
                                        />)}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </KeyboardAwareScrollView>

                    <View className="border-t border-border bg-background p-4">
                        <GradientButton
                            disabled={!hasCategory || !isOnline}
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
