import { z } from "zod";
import type { Path } from "react-hook-form";

export const registerSchema = z
    .object({
        email: z.string().min(1).max(256)
            .email(),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" })
            .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
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
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const REGISTER_STEPS = ["credentials", "names", "address", "pfp"] as const;
export type RegisterStep = (typeof REGISTER_STEPS)[number];

export const REGISTER_STEP_FIELDS: Record<RegisterStep, Array<Path<RegisterFormValues>>> = {
    credentials: ["email", "password", "confirmPassword"],
    names: ["firstname", "surname"],
    address: ["country", "region", "city", "postalCode", "street"],
    pfp: [],
};

export const REGISTER_INPUT_CLASS = "h-14 rounded-[10px] border-[1.5px] border-forehued px-[25px] font-noto-medium text-[16px] text-forehued";
