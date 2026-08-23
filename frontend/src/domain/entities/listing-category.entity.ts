export const LISTING_CATEGORIES = [
    { value: "moving", label: "Moving" },
    { value: "cooking", label: "Cooking" },
    { value: "gardening", label: "Gardening" },
    { value: "carpentry", label: "Carpentry" },
    { value: "childcare", label: "Childcare" },
    { value: "cleaning", label: "Cleaning" },
    { value: "tutoring", label: "Tutoring" },
    { value: "tech_help", label: "Tech help" },
    { value: "pet_care", label: "Pet care" },
    { value: "other", label: "Other" },
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number]["value"];

export const LISTING_TYPES = [
    { value: "offer", label: "Offer" },
    { value: "request", label: "Request" },
] as const;

export type ListingType = (typeof LISTING_TYPES)[number]["value"];
