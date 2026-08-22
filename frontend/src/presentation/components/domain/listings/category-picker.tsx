import * as React from "react";
import { Pressable, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { LISTING_CATEGORIES, type ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

interface CategoryPickerProps {
    readonly value: ListingCategory | undefined,
    readonly onChange: (value: ListingCategory) => void,
}

/**
 * Render a required, single-select category chip picker for the
 * create/edit listing forms (as opposed to `CategoryFilterChips`, which is
 * nullable and used to filter the listings feed).
 * @param props - The props.
 * @param props.value - The currently selected category.
 * @param props.onChange - Called with the newly selected category.
 * @returns The rendered chip row.
 */
export function CategoryPicker({ value, onChange }: CategoryPickerProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <ScrollView
            contentContainerStyle={{ gap: 8 }}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            {LISTING_CATEGORIES.map(category => <Pressable
                    className={cn(
                        "rounded-full px-4 py-2",
                        value === category.value ? "bg-forehued" : "bg-surfhued",
                    )}
                    key={category.value}
                    onPress={() => { onChange(category.value); }}
                >
                    <Text
                        className={cn(
                            "text-sm font-noto-semibold",
                            value === category.value ? "text-white" : "text-forehued",
                        )}
                    >
                        {t(`listingCategory.${category.value}`)}
                    </Text>
                 </Pressable>,)}
        </ScrollView>
    );
}
