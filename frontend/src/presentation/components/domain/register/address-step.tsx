import * as React from "react";
import type { Control } from "react-hook-form";
import { View } from "react-native";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface AddressStepProps {
    readonly control: Control<RegisterFormValues>,
}

/**
 *
 * @param root0
 * @param root0.control
 */
export function AddressStep({ control }: AddressStepProps): React.JSX.Element {
    return (
        <>
            <FormField
                control={control}
                label="Country"
                name="country"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder="United States of America"
                        value={value}
                    />)}
            </FormField>

            <FormField
                control={control}
                label="Region"
                name="region"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder="New York"
                        value={value}
                    />)}
            </FormField>

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <FormField
                        control={control}
                        label="City"
                        name="city"
                    >
                        {({ value, onChange }) => (<Input
                                className={REGISTER_INPUT_CLASS}
                                onChangeText={onChange}
                                placeholder="New York City"
                                value={value}
                            />)}
                    </FormField>
                </View>

                <View className="flex-1">
                    <FormField
                        control={control}
                        label="Postal code"
                        name="postalCode"
                    >
                        {({ value, onChange }) => (<Input
                                className={REGISTER_INPUT_CLASS}
                                onChangeText={onChange}
                                placeholder="NY 10001"
                                value={value}
                            />)}
                    </FormField>
                </View>
            </View>

            <FormField
                control={control}
                label="Street"
                name="street"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder="123 Main Street"
                        value={value}
                    />)}
            </FormField>
        </>
    );
}
