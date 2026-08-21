import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { cn } from "@/presentation/utils/cn.util";

interface SegmentedControlOption<T extends string> {
    readonly value: T,
    readonly label: string,
}

interface SegmentedControlProps<T extends string> {
    readonly options: ReadonlyArray<SegmentedControlOption<T>>,
    readonly value: T,
    readonly onChange: (value: T) => void,
}

/**
 * A two-or-more-way toggle (e.g. Offer / Request), matching the Figma
 * design system's bordered-input styling.
 * @param root0
 * @param root0.options
 * @param root0.value
 * @param root0.onChange
 */
export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
}: SegmentedControlProps<T>): React.JSX.Element {
    return (
        <View className="flex-row overflow-hidden rounded-[10px] border-[1.5px] border-forehued">
            {options.map((option, index) => <Pressable
                    className={cn(
                        "flex-1 items-center py-[13px]",
                        value === option.value ? "bg-forehued" : "bg-white",
                        index > 0 && "border-l-[1.5px] border-forehued",
                    )}
                    key={option.value}
                    onPress={() => { onChange(option.value); }}
                >
                    <Text
                        className={cn(
                            "font-noto-semibold text-[16px]",
                            value === option.value ? "text-white" : "text-forehued",
                        )}
                    >
                        {option.label}
                    </Text>
                 </Pressable>,)}
        </View>
    );
}
