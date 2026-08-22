import * as React from "react";
import type { Control } from "react-hook-form";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { FormField } from "@/presentation/components/primitives/form-field";
import { REGISTER_INPUT_CLASS, type RegisterFormValues } from "@/presentation/components/domain/register/schema";

interface AddressStepProps {
    readonly control: Control<RegisterFormValues>,
}

/**
 * Render the address step of the registration wizard.
 * @param props - The props.
 * @param props.control - The shared react-hook-form control for the registration form.
 * @returns The rendered step fields.
 */
export function AddressStep({ control }: AddressStepProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <>
            <FormField
                control={control}
                label={t("register.address.countryLabel")}
                name="country"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder={t("register.address.countryPlaceholder")}
                        value={value}
                    />)}
            </FormField>

            <FormField
                control={control}
                label={t("register.address.regionLabel")}
                name="region"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder={t("register.address.regionPlaceholder")}
                        value={value}
                    />)}
            </FormField>

            <View className="flex-row gap-3">
                <View className="flex-1">
                    <FormField
                        control={control}
                        label={t("register.address.cityLabel")}
                        name="city"
                    >
                        {({ value, onChange }) => (<Input
                                className={REGISTER_INPUT_CLASS}
                                onChangeText={onChange}
                                placeholder={t("register.address.cityPlaceholder")}
                                value={value}
                            />)}
                    </FormField>
                </View>

                <View className="flex-1">
                    <FormField
                        control={control}
                        label={t("register.address.postalCodeLabel")}
                        name="postalCode"
                    >
                        {({ value, onChange }) => (<Input
                                className={REGISTER_INPUT_CLASS}
                                onChangeText={onChange}
                                placeholder={t("register.address.postalCodePlaceholder")}
                                value={value}
                            />)}
                    </FormField>
                </View>
            </View>

            <FormField
                control={control}
                label={t("register.address.streetLabel")}
                name="street"
            >
                {({ value, onChange }) => (<Input
                        className={REGISTER_INPUT_CLASS}
                        onChangeText={onChange}
                        placeholder={t("register.address.streetPlaceholder")}
                        value={value}
                    />)}
            </FormField>
        </>
    );
}
