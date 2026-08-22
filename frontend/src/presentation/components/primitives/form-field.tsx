import { Controller, type Control, type FieldPathValue, type FieldValues, type Path } from "react-hook-form";
import * as React from "react";
import { View, Text } from "react-native";
import { Label } from "@/presentation/components/primitives/rnreusables/ui/label";

interface FormFieldProps<T extends FieldValues> {
    readonly control: Control<T>,
    readonly name: Path<T>,
    readonly label?: string,
    readonly children: (props: {
        value: FieldPathValue<T, Path<T>>,
        onChange: (value: FieldPathValue<T, Path<T>>) => void,
        error?: string,
    }) => React.ReactNode,
}

/**
 * Render a labeled form field wired to a react-hook-form controller, showing a validation error when present.
 * @param props - The props.
 * @param props.control - The react-hook-form control managing the field.
 * @param props.name - The field's path within the form values.
 * @param props.label - The label shown above the field, if any.
 * @param props.children - A render prop receiving the field's value/onChange/error and returning the input.
 * @returns The rendered form field.
 */
export function FormField<T extends FieldValues>({
    control,
    name,
    label,
    children,
}: FormFieldProps<T>): React.JSX.Element {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => <View className="mb-4">
                    {label != null
? <Label className={`text-base mb-1 ${error != null ? "text-destructive" : ""}`}>
                        {label}
                    </Label>
: null}

                    {children?.({
                        value,
                        onChange,
                        error: error?.message,
                    })}

                    {error
? <Text className="text-destructive text-sm ml-1 mt-1">
                        {error.message}
                    </Text>
: null}
                </View>}
        />
    );
}
