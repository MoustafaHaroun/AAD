import * as React from "react";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { PasswordInput } from "@/presentation/components/primitives/password-input";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface CredentialsStepProps {
    readonly control: Control<RegisterFormValues>,
}

/**
 * Render the credentials step of the registration wizard.
 * @param props - The props.
 * @param props.control - The shared react-hook-form control for the registration form.
 * @returns The rendered step fields.
 */
export function CredentialsStep({ control }: CredentialsStepProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <FormField
                control={control}
                label={t("register.credentials.emailLabel")}
                name="email"
            >
                {({ value, onChange }) => <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    className={REGISTER_INPUT_CLASS}
                    keyboardType="email-address"
                    onChangeText={onChange}
                    placeholder={t("register.credentials.emailPlaceholder")}
                    value={value}
                />}
            </FormField>

            <FormField
                control={control}
                label={t("register.credentials.passwordLabel")}
                name="password"
            >
                {({ value, onChange }) => <PasswordInput
                    autoComplete="new-password"
                    className={REGISTER_INPUT_CLASS}
                    onChangeText={onChange}
                    value={value}
                />}
            </FormField>

            <FormField
                control={control}
                label={t("register.credentials.confirmPasswordLabel")}
                name="confirmPassword"
            >
                {({ value, onChange }) => <PasswordInput
                    autoComplete="new-password"
                    className={REGISTER_INPUT_CLASS}
                    onChangeText={onChange}
                    value={value}
                />}
            </FormField>
        </>
    );
}
