import * as React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { Textarea } from "@/presentation/components/primitives/rnreusables/ui/textarea";
import { FormField } from "@/presentation/components/primitives/form-field";
import { SegmentedControl } from "@/presentation/components/primitives/segmented-control";
import { CategoryPicker } from "@/presentation/components/domain/listings/category-picker";
import type { ListingCategory, ListingType } from "@/domain/entities/listing-category.entity";

const INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";

interface ListingBasicFieldsProps<T extends FieldValues> {
    readonly control: Control<T>,
    readonly titleField: Path<T>,
    readonly descriptionField: Path<T>,
    readonly type?: ListingType,
    readonly typeOptions: Array<{ value: ListingType, label: string }>,
    readonly onChangeType: (value: ListingType) => void,
    readonly category?: ListingCategory,
    readonly onChangeCategory: (value: ListingCategory) => void,
}

/**
 * Render a listing form's shared title, type, category, and description fields.
 * @param props - The props.
 * @param props.control - The react-hook-form control managing the form.
 * @param props.titleField - The form field name for the title input.
 * @param props.descriptionField - The form field name for the description input.
 * @param props.type - The currently selected offer/request type.
 * @param props.typeOptions - The type segmented-control's options.
 * @param props.onChangeType - Called when the type is changed.
 * @param props.category - The currently selected category.
 * @param props.onChangeCategory - Called when the category is changed.
 * @returns The rendered fields.
 */
export function ListingBasicFields<T extends FieldValues>({
    control, titleField, descriptionField, type, typeOptions, onChangeType, category, onChangeCategory,
}: ListingBasicFieldsProps<T>): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <FormField
                control={control}
                label={t("listingForm.titleLabel")}
                name={titleField}
            >
                {({ value, onChange }) => <Input
                    className={INPUT_CLASS}
                    onChangeText={onChange as (text: string) => void}
                    value={value}
                />}
            </FormField>

            <View className="mb-4 gap-2">
                <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.typeLabel")}</Text>

                {type == null
                    ? null
                    : <SegmentedControl
                            onChange={onChangeType}
                            options={typeOptions}
                            value={type}
                        />}
            </View>

            <View className="mb-4 gap-2">
                <Text className="text-[16px] font-noto-semibold text-black">{t("listingForm.categoryLabel")}</Text>

                <CategoryPicker
                    onChange={onChangeCategory}
                    value={category}
                />
            </View>

            <FormField
                control={control}
                label={t("listingForm.descriptionLabel")}
                name={descriptionField}
            >
                {({ value, onChange }) => <Textarea
                    className={INPUT_CLASS}
                    onChangeText={onChange as (text: string) => void}
                    // eslint-disable-next-line react/forbid-component-props -- fixed height beyond what the shared className expresses
                    style={{ height: 191, textAlignVertical: "top" }}
                    value={value}
                />}
            </FormField>
        </>
    );
}
