import * as React from "react";
import { Pressable, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { LISTING_CATEGORIES, type ListingCategory } from "@/domain/entities/listing-category.entity";
import { cn } from "@/presentation/utils/cn.util";

interface CategoryFilterChipsProps {
    readonly value: ListingCategory | undefined,
    readonly onChange: (value: ListingCategory | undefined) => void,
}

/**
 *
 * @param root0
 * @param root0.value
 * @param root0.onChange
 */
export function CategoryFilterChips({ value, onChange }: CategoryFilterChipsProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <ScrollView
            contentContainerStyle={{ gap: 8 }}
            horizontal
            showsHorizontalScrollIndicator={false}
        >
            <Pressable
                className={cn("rounded-full px-4 py-2", value == null ? "bg-forehued" : "bg-surfhued")}
                onPress={() => { onChange(undefined); }}
            >
                <Text className={cn("text-sm font-noto-semibold", value == null ? "text-white" : "text-forehued")}>
                    {t("common.all")}
                </Text>
            </Pressable>

            {LISTING_CATEGORIES.map(category => <Pressable
                    className={cn(
                        "rounded-full px-4 py-2",
                        value === category.value ? "bg-forehued" : "bg-surfhued",
                    )}
                    key={category.value}
                    onPress={() => { onChange(value === category.value ? undefined : category.value); }}
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
