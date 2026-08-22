import * as React from "react";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface NamesStepProps {
    readonly control: Control<RegisterFormValues>;
}

export function NamesStep({ control }: NamesStepProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <FormField control={control} label={t("register.names.firstnameLabel")} name="firstname">
                {({ value, onChange }) => (
                    <Input
                        autoComplete="given-name"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder={t("register.names.firstnamePlaceholder")}
                        value={value}
                    />
                )}
            </FormField>

            <FormField control={control} label={t("register.names.surnameLabel")} name="surname">
                {({ value, onChange }) => (
                    <Input
                        autoComplete="family-name"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder={t("register.names.surnamePlaceholder")}
                        value={value}
                    />
                )}
            </FormField>
        </>
    );
}
