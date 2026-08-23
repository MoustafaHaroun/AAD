import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { ListingBasicFields } from "@/presentation/components/domain/listings/listing-basic-fields";
import {
    AddPhotoButton,
    AttachmentThumbnail,
    TapToRemoveThumbnail,
} from "@/presentation/components/domain/listings/listing-photo-field";
import { DeleteListingDialog } from "@/presentation/components/domain/listings/delete-listing-dialog";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    useGetApiListing,
    useUpdateApiListing,
    useDeleteApiListing,
    useUploadListingAttachment,
    useRemoveListingAttachment,
    useImageService,
    useNetworkStatus,
    useListingDraft,
} from "@/presentation/hooks";
import {
    LISTING_CATEGORIES,
    LISTING_TYPES,
    type ListingCategory,
    type ListingType,
} from "@/domain/entities/listing-category.entity";
import type { ApiListing } from "@/domain/entities";
import type { ListingDraft } from "@/infrastructure/persistence/drafts/listing-draft-store";

const CATEGORY_VALUES = LISTING_CATEGORIES.map(c => c.value) as [ListingCategory, ...ListingCategory[]];
const TYPE_VALUES = LISTING_TYPES.map(t => t.value) as [ListingType, ...ListingType[]];

const editListingSchema = z.object({
    title: z.string().min(3).max(64),
    description: z.string().max(255).optional(),
    category: z.enum(CATEGORY_VALUES),
    type: z.enum(TYPE_VALUES),
});

/**
 * Build the edit form's reset values, preferring a locally-saved draft field over the listing's own.
 * @param draft - The locally-saved draft, if one was found.
 * @param listing - The loaded listing.
 * @returns The form's reset values.
 */
function buildResetValues(draft: ListingDraft | null, listing: ApiListing): Partial<z.infer<typeof editListingSchema>> {
    return {
        title: draft?.title ?? listing.title,
        description: draft?.description ?? listing.description ?? "",
        category: (draft?.category as ListingCategory | undefined) ?? listing.category,
        type: (draft?.type as ListingType | undefined) ?? listing.type,
    };
}

/**
 * Load an edit-in-progress listing and assemble the derived state its form needs.
 * @returns The edit-listing screen's view state.
 */
function useEditListingState(): {
    id: string,
    router: ReturnType<typeof useRouter>,
    t: ReturnType<typeof useTranslation>["t"],
    listing: ReturnType<typeof useGetApiListing>["data"],
    error: Error | null,
    isOnline: boolean,
    isDeleting: boolean,
    control: ReturnType<typeof useForm<z.infer<typeof editListingSchema>>>["control"],
    handleSubmit: ReturnType<typeof useForm<z.infer<typeof editListingSchema>>>["handleSubmit"],
    setValue: ReturnType<typeof useForm<z.infer<typeof editListingSchema>>>["setValue"],
    category: ListingCategory | undefined,
    type: ListingType | undefined,
    typeOptions: Array<{ value: ListingType, label: string }>,
    newAttachments: string[],
    addAttachment: () => void,
    removeNewAttachment: (uri: string) => void,
    removeExistingAttachment: (attachmentId: string) => void,
    onDelete: () => void,
    onSave: (data: z.infer<typeof editListingSchema>) => Promise<void>,
} {
    const router = useRouter();
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const imageService = useImageService();
    const { mutateAsync: updateListing, error } = useUpdateApiListing();
    const { mutate: deleteListing, isPending: isDeleting } = useDeleteApiListing();
    const { mutateAsync: uploadAttachment } = useUploadListingAttachment();
    const { mutateAsync: removeAttachment } = useRemoveListingAttachment();
    const { data: listing } = useGetApiListing(id);
    const isOnline = useNetworkStatus();
    const { draft, draftLoaded, saveDraft, clearDraft } = useListingDraft(id);
    const { control, handleSubmit, reset, watch, setValue } = useForm<z.infer<typeof editListingSchema>>({
        resolver: zodResolver(editListingSchema),
    });

    const [newAttachments, setNewAttachments] = useState<string[]>([]);
    const category = watch("category");
    const type = watch("type");
    const typeOptions = LISTING_TYPES.map(option => ({ value: option.value, label: t(`listingType.${option.value}`) }));

    useEffect(() => {
        if (listing == null || !draftLoaded) {
            return;
        }

        reset(buildResetValues(draft, listing));
    }, [listing, draftLoaded]);

    useEffect(() => {
        const subscription = watch(values => {
            saveDraft({ title: values.title, description: values.description, category: values.category, type: values.type });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch]);

    /**
     * Pick or capture a photo and add it to the attachments to upload on save.
     */
    function addAttachment(): void {
        void imageService.pickImage().then(uri => {
            if (uri != null) {
                setNewAttachments(prev => [...prev, uri]);
            }
        });
    }

    /**
     * Remove a not-yet-uploaded photo from the attachments to upload on save.
     * @param uri - The local URI of the attachment to remove.
     */
    function removeNewAttachment(uri: string): void {
        setNewAttachments(prev => prev.filter(u => u !== uri));
    }

    /**
     * Remove an already-uploaded photo from the listing.
     * @param attachmentId - The id of the attachment to remove.
     */
    function removeExistingAttachment(attachmentId: string): void {
        void removeAttachment({ id, attachmentId });
    }

    /**
     * Delete the listing and return to the listings screen.
     */
    function onDelete(): void {
        deleteListing({ id }, { onSuccess: () => {
            clearDraft();
            router.replace("/listings");
        } });
    }

    /**
     * Save the listing changes, upload any new photos, clear the draft, and go back.
     * @param data - The validated listing field values.
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

        clearDraft();
        router.back();
    }

    return {
        id,
        router,
        t,
        listing,
        error,
        isOnline,
        isDeleting,
        control,
        handleSubmit,
        setValue,
        category,
        type,
        typeOptions,
        newAttachments,
        addAttachment,
        removeNewAttachment,
        removeExistingAttachment,
        onDelete,
        onSave,
    };
}

/**
 * Render the edit-listing form, restoring any saved draft, and save or delete the listing.
 * @returns The rendered edit-listing screen.
 */
export default function EditListingScreen(): React.JSX.Element {
    const {
        t, listing, error, isOnline, isDeleting,
        control, handleSubmit, setValue, category, type, typeOptions,
        newAttachments, addAttachment, removeNewAttachment, removeExistingAttachment,
        onDelete, onSave,
    } = useEditListingState();

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

                            <ScrollView horizontal>
                                <View className="flex-row gap-2">
                                    <AddPhotoButton
                                        isOnline={isOnline}
                                        onPress={addAttachment}
                                    />

                                    {listing?.attachments?.map(attachment => <AttachmentThumbnail
                                        key={attachment.id}
                                        onRemove={() => { removeExistingAttachment(attachment.id); }}
                                        removeDisabled={!isOnline}
                                        uri={attachment.path}
                                    />)}

                                    {newAttachments.map(uri => <TapToRemoveThumbnail
                                        key={uri}
                                        onRemove={() => { removeNewAttachment(uri); }}
                                        uri={uri}
                                    />)}
                                </View>
                            </ScrollView>
                        </View>

                        {error != null &&
                            <Text className="mb-4 text-sm text-destructive">{error.message}</Text>}
                    </ScrollView>

                    <View className="flex-row gap-3 border-t border-border bg-background p-4">
                        <GradientButton
                            className="flex-1"
                            disabled={listing == null || !isOnline}
                            onPress={() => { void handleSubmit(onSave)(); }}
                        >
                            {t("common.save")}
                        </GradientButton>

                        <DeleteListingDialog
                            disabled={listing == null || !isOnline}
                            isDeleting={isDeleting}
                            onConfirm={onDelete}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
