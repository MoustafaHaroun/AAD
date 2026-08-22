import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Plus, Trash, X } from "lucide-react-native";
import { View, ScrollView, Platform, Pressable, Image, ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppHeader } from "@/presentation/components/containers/app-header";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/presentation/components/primitives/rnreusables";
import { FormField } from "@/presentation/components/primitives/form-field";
import { GradientButton } from "@/presentation/components/primitives/gradient-button";
import { SegmentedControl } from "@/presentation/components/primitives/segmented-control";
import { CategoryPicker } from "@/presentation/components/domain/listings/category-picker";
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
import { cn } from "@/presentation/utils/cn.util";

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
        if (listing == null || !draftLoaded) { return; }

        reset({
            title: draft?.title ?? listing.title,
            description: draft?.description ?? listing.description ?? "",
            category: (draft?.category as ListingCategory | undefined) ?? listing.category,
            type: (draft?.type as ListingType | undefined) ?? listing.type,
        });
    }, [listing, draftLoaded]);

    useEffect(() => {
        const subscription = watch(values => {
            saveDraft({ title: values.title, description: values.description, category: values.category, type: values.type });
        });

        return () => { subscription.unsubscribe(); };
    }, [watch]);

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
     */
    function onDelete(): void {
        deleteListing({ id }, { onSuccess: () => {
            clearDraft();
            router.replace("/listings");
        } });
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
                            {({ value, onChange }) => <Input
className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    value={value}
                                />}
                        </FormField>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.typeLabel")}</Text>

                            {type != null &&
                                <SegmentedControl
                                    onChange={value => { setValue("type", value); }}
                                    options={typeOptions}
                                    value={type}
                                />}
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
                            {({ value, onChange }) => (<Textarea
                                    className={INPUT_CLASS}
                                    onChangeText={onChange}
                                    style={{ height: 191, textAlignVertical: "top" }}
                                    value={value}
                                />)}
                        </FormField>

                        <View className="mb-4 gap-2">
                            <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.photosLabel")}</Text>

                            <ScrollView horizontal>
                                <View className="flex-row gap-2">
                                    <Pressable
                                        accessibilityLabel={t("common.addPhoto")}
                                        accessibilityRole="button"
                                        className={cn("h-20 w-20 items-center justify-center rounded-[10px] bg-surfhued", !isOnline && "opacity-50")}
                                        disabled={!isOnline}
                                        onPress={addAttachment}
                                    >
                                        <View className="size-12 items-center justify-center rounded-full bg-forehued">
                                            <Icon
                                                as={Plus}
                                                className="size-6 text-white"
                                            />
                                        </View>
                                    </Pressable>

                                    {listing?.attachments?.map(attachment => (<View className="relative"
key={attachment.id}>
                                            <Image
                                                className="h-20 w-20 rounded-[10px]"
                                                resizeMode="cover"
                                                source={{ uri: attachment.path }}
                                            />

                                            <Pressable
                                                accessibilityLabel={t("common.removePhoto")}
                                                accessibilityRole="button"
                                                className={cn("absolute -right-1 -top-1 size-5 items-center justify-center rounded-full bg-forehued", !isOnline && "opacity-50")}
                                                disabled={!isOnline}
                                                hitSlop={8}
                                                onPress={async () => removeAttachment({ id, attachmentId: attachment.id })}
                                            >
                                                <Icon as={X}
className="size-3 text-white" />
                                            </Pressable>
                                         </View>),)}

                                    {newAttachments.map(uri => (<Pressable
accessibilityLabel={t("common.removePhoto")}
accessibilityRole="button"
key={uri}
onPress={() => removeNewAttachment(uri)}>
                                            <Image
                                                className="h-20 w-20 rounded-[10px]"
                                                resizeMode="cover"
                                                source={{ uri }}
                                            />
                                         </Pressable>),)}
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
                            onPress={handleSubmit(onSave)}
                        >
                            {t("common.save")}
                        </GradientButton>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Pressable
                                    accessibilityLabel={t("common.delete")}
                                    accessibilityRole="button"
                                    className={cn("w-16 items-center justify-center self-stretch rounded-[10px] bg-destructive", !isOnline && "opacity-50")}
                                    disabled={listing == null || isDeleting || !isOnline}
                                >
                                    {isDeleting
                                        ? <ActivityIndicator color="white" />
                                        : <Icon
                                                as={Trash}
                                                className="size-6 text-white"
                                          />}
                                </Pressable>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="gap-4 rounded-[20px] p-6">
                                <AlertDialogHeader className="gap-2">
                                    <AlertDialogTitle className="text-left text-[22px] font-noto-bold text-black">
                                        {t("listing.deleteTitle")}
                                    </AlertDialogTitle>

                                    <AlertDialogDescription className="text-left text-[14px] font-noto-medium text-black">
                                        {t("listing.deleteDescription")}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter className="flex-row gap-3">
                                    <AlertDialogCancel className="flex-1 rounded-[10px] border-0 bg-primdesat">
                                        <Text className="font-noto-semibold text-black">{t("common.cancel")}</Text>
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        className="flex-1 rounded-[10px] bg-destructive"
                                        onPress={onDelete}
                                    >
                                        <Text className="font-noto-bold text-white">{t("common.delete")}</Text>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}
