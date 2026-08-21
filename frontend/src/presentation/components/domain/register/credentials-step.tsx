import * as React from "react";
import type { Control } from "react-hook-form";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { PasswordInput } from "@/presentation/components/primitives/password-input";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface CredentialsStepProps {
    readonly control: Control<RegisterFormValues>,
}

/**
 *
 * @param root0
 * @param root0.control
 */
export function CredentialsStep({ control }: CredentialsStepProps): React.JSX.Element {
    return (
        <>
            <FormField
                control={control}
                label="Email address"
                name="email"
            >
                {({ value, onChange }) => (<Input
                        autoCapitalize="none"
                        autoComplete="email"
                        className={REGISTER_INPUT_CLASS}
                        keyboardType="email-address"
                        onChangeText={onChange}
                        placeholder="example@email.com"
                        value={value}
                    />)}
            </FormField>

            <FormField
                control={control}
                label="Password"
                name="password"
            >
                {({ value, onChange }) => (<PasswordInput
                        autoComplete="new-password"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        value={value}
                    />)}
            </FormField>

            <FormField
                control={control}
                label="Repeat password"
                name="confirmPassword"
            >
                {({ value, onChange }) => (<PasswordInput
                        autoComplete="new-password"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        value={value}
                    />)}
            </FormField>
        </>
    );
}
