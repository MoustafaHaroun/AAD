import { z } from "zod";
import type { Path } from "react-hook-form";
import type { TFunction } from "i18next";

export function createRegisterSchema(t: TFunction) {
    return z
        .object({
            email: z.string().min(1).max(256)
                .email(),
            password: z
                .string()
                .min(8, { message: t("register.errors.passwordTooShort") })
                .regex(/[a-z]/, { message: t("register.errors.passwordLowercase") })
                .regex(/[A-Z]/, { message: t("register.errors.passwordUppercase") })
                .regex(/[0-9]/, { message: t("register.errors.passwordNumber") })
                .regex(/[^A-Za-z0-9]/, { message: t("register.errors.passwordSpecial") }),
            confirmPassword: z.string().min(1),
            firstname: z.string().min(1).max(128),
            surname: z.string().min(1).max(128),
            country: z.string().min(1),
            region: z.string().min(1),
            city: z.string().min(1),
            postalCode: z.string().min(1),
            street: z.string().min(1),
        })
        .refine(data => data.password === data.confirmPassword, {
            message: t("register.errors.passwordMismatch"),
            path: ["confirmPassword"],
        });
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export const REGISTER_STEPS = ["credentials", "names", "address", "pfp"] as const;
export type RegisterStep = (typeof REGISTER_STEPS)[number];

export const REGISTER_STEP_FIELDS: Record<RegisterStep, Array<Path<RegisterFormValues>>> = {
    credentials: ["email", "password", "confirmPassword"],
    names: ["firstname", "surname"],
    address: ["country", "region", "city", "postalCode", "street"],
    pfp: [],
};

export const REGISTER_INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";
