import { z } from "zod";
import type { TFunction } from "i18next";
import { LISTING_CATEGORIES, LISTING_TYPES, type ListingCategory, type ListingType } from "@/domain/entities/listing-category.entity";

const CATEGORY_VALUES = LISTING_CATEGORIES.map(c => c.value) as [ListingCategory, ...ListingCategory[]];
const TYPE_VALUES = LISTING_TYPES.map(t => t.value) as [ListingType, ...ListingType[]];

/**
 * Build the zod schema shared by the create-listing and edit-listing forms, with translated error messages.
 * @param t - The translation function used for validation error messages.
 * @returns The listing form schema.
 */
// eslint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
export function createListingFormSchema(t: TFunction) {
    return z.object({
        title: z
            .string()
            .min(3, { message: t("listingForm.errors.titleTooShort") })
            .max(64, { message: t("listingForm.errors.titleTooLong") }),
        description: z.string().max(255, { message: t("listingForm.errors.descriptionTooLong") }).optional(),
        category: z.enum(CATEGORY_VALUES),
        type: z.enum(TYPE_VALUES),
    });
}

export type ListingFormValues = z.infer<ReturnType<typeof createListingFormSchema>>;
