import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { View, Text } from "react-native";
import { Label } from "@/presentation/components/primitives/rnreusables/ui/label";

interface FormFieldProps<T extends FieldValues> {
    readonly control: Control<T>,
    readonly name: Path<T>,
    readonly label?: string,
    readonly children: (props: {
        value: any,
        onChange: (value: any) => void,
        error?: string,
    }) => React.ReactNode,
}

/**
 *
 * @param root0
 * @param root0.control
 * @param root0.name
 * @param root0.label
 * @param root0.children
 */
export function FormField<T extends FieldValues>({
    control,
    name,
    label,
    children,
}: FormFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => <View className="mb-4">
                    {label
? <Label className={`text-base mb-1 ${error && "text-destructive"}`}>
                        {label}
                    </Label>
: null}

                    {children?.({
                        className: `${error && "border-destructive text-destructive"}`,
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
