import * as React from "react";
import { Pressable, ScrollView } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { LISTING_CATEGORIES, type ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

interface CategoryPickerProps {
    readonly value: ListingCategory | undefined,
    readonly onChange: (value: ListingCategory) => void,
}

/**
 * Required, single-select category chip picker for the create/edit listing
 * forms (as opposed to `CategoryFilterChips`, which is nullable and used to
 * filter the listings feed).
 * @param root0
 * @param root0.value
 * @param root0.onChange
 */
export function CategoryPicker({ value, onChange }: CategoryPickerProps): React.JSX.Element {
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
                        {category.label}
                    </Text>
                 </Pressable>,)}
        </ScrollView>
    );
}
