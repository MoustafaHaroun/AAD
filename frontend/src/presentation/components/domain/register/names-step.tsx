import * as React from "react";
import type { Control } from "react-hook-form";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface NamesStepProps {
    readonly control: Control<RegisterFormValues>,
}

/**
 *
 * @param root0
 * @param root0.control
 */
export function NamesStep({ control }: NamesStepProps): React.JSX.Element {
    return (
        <>
            <FormField
                control={control}
                label="Firstname"
                name="firstname"
            >
                {({ value, onChange }) => (<Input
                        autoComplete="given-name"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder="John"
                        value={value}
                    />)}
            </FormField>

            <FormField
                control={control}
                label="Lastname"
                name="surname"
            >
                {({ value, onChange }) => (<Input
                        autoComplete="family-name"
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder="Doe"
                        value={value}
                    />)}
            </FormField>
        </>
    );
}
