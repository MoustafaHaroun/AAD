import { z } from "zod";
import type { Path } from "react-hook-form";
import type { TFunction } from "i18next";

/**
 * Build the zod schema for the registration form, with translated error messages.
 * @param t - The translation function used for validation error messages.
 * @returns The registration form schema.
 */
// eslint-disable-next-line typescript/explicit-function-return-type, typescript/explicit-module-boundary-types
export function createRegisterSchema(t: TFunction) {
    return z
        .object({
            email: z.email({ message: t("common.errors.invalidEmail") }).min(1, { message: t("common.errors.required") }).max(256),
            password: z
                .string()
                .min(8, { message: t("register.errors.passwordTooShort") })
                .regex(/[a-z]/u, { message: t("register.errors.passwordLowercase") })
                .regex(/[A-Z]/u, { message: t("register.errors.passwordUppercase") })
                .regex(/[0-9]/u, { message: t("register.errors.passwordNumber") })
                .regex(/[^A-Za-z0-9]/u, { message: t("register.errors.passwordSpecial") }),
            confirmPassword: z.string().min(1, { message: t("common.errors.required") }),
            firstname: z.string().min(1, { message: t("common.errors.required") }).max(128),
            surname: z.string().min(1, { message: t("common.errors.required") }).max(128),
            country: z.string().min(1, { message: t("common.errors.required") }),
            region: z.string().min(1, { message: t("common.errors.required") }),
            city: z.string().min(1, { message: t("common.errors.required") }),
            postalCode: z.string().min(1, { message: t("common.errors.required") }),
            street: z.string().min(1, { message: t("common.errors.required") }),
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
