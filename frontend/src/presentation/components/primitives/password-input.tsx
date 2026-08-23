import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { useState } from "react";
import { Pressable, View, type TextInputProps } from "react-native";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Input } from "@/presentation/components/primitives/rnreusables/ui/input";
import { cn } from "@/presentation/utils/cn.util";

/**
 * Render a password input with show/hide toggle.
 * @param props - The props.
 * @param props.className - The NativeWind classes to be forwarded.
 * @returns The rendered password input.
 */
export function PasswordInput({
    className,
    ...props
}: TextInputProps & React.RefAttributes<React.ComponentRef<typeof Input>>): React.JSX.Element {
    const [visible, setVisible] = useState(false);

    return (
        <View className="relative justify-center">
            <Input
                className={cn("pr-12", className)}
                secureTextEntry={!visible}
                {...props}
            />

            <Pressable
                className="absolute right-[16px]"
                onPress={() => { setVisible(prev => !prev); }}
            >
                <Icon
                    as={visible ? EyeOff : Eye}
                    className="size-6 text-forehued"
                />
            </Pressable>
        </View>
    );
}
