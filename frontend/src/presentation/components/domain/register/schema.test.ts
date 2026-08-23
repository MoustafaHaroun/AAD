import { createRegisterSchema } from "@/presentation/components/domain/register/schema";
import type { TFunction } from "i18next";

const t = ((key: string) => key) as unknown as TFunction;

const VALID_FIELDS = {
    email: "user@example.com",
    password: "Passw0rd!",
    confirmPassword: "Passw0rd!",
    firstname: "Jane",
    surname: "Doe",
    country: "Nederland",
    region: "Overijssel",
    city: "Enschede",
    postalCode: "7511 AB",
    street: "Hoofdstraat 1",
};

describe("createRegisterSchema", () => {
    it("accepts a fully valid submission", () => {
        const result = createRegisterSchema(t).safeParse(VALID_FIELDS);

        expect(result.success).toBe(true);
    });

    it("rejects a password missing a lowercase letter", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, password: "PASSW0RD!", confirmPassword: "PASSW0RD!" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordLowercase")).toBe(true);
    });

    it("rejects a password missing an uppercase letter", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, password: "passw0rd!", confirmPassword: "passw0rd!" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordUppercase")).toBe(true);
    });

    it("rejects a password missing a digit", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, password: "Password!", confirmPassword: "Password!" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordNumber")).toBe(true);
    });

    it("rejects a password missing a special character", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, password: "Passw0rd", confirmPassword: "Passw0rd" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordSpecial")).toBe(true);
    });

    it("rejects a password shorter than 8 characters", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, password: "P0w!", confirmPassword: "P0w!" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordTooShort")).toBe(true);
    });

    it("rejects mismatched passwords", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, confirmPassword: "Different0!" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "register.errors.passwordMismatch")).toBe(true);
    });

    it("rejects an invalid email", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, email: "not-an-email" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "common.errors.invalidEmail")).toBe(true);
    });

    it("rejects a missing required field", () => {
        const result = createRegisterSchema(t).safeParse({ ...VALID_FIELDS, firstname: "" });

        expect(result.success).toBe(false);
        expect(result.error?.issues.some(issue => issue.message === "common.errors.required")).toBe(true);
    });
});
