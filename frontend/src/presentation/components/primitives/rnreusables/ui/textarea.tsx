import { cn } from "@/presentation/utils/cn.util";
import { Platform, TextInput, type TextInputProps } from "react-native";

/**
 *
 * @param root0
 * @param root0.className
 * @param root0.multiline
 * @param root0.numberOfLines
 * @param root0.placeholderClassName
 */
function Textarea({
    className,
    multiline = true,
    numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
    placeholderClassName,
    ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
    return (
        <TextInput
            className={cn(
                "text-foreground border-input dark:bg-input/30 flex min-h-16 w-full flex-row rounded-md border bg-transparent px-3 py-2 text-base shadow-sm shadow-black/5 md:text-sm",
                Platform.select({
                    web: "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed",
                    native: "placeholder:text-muted-foreground/50",
                }),
                props.editable === false && "opacity-50",
                className,
            )}
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
            textAlignVertical="top"
            {...props}
        />
    );
}

export { Textarea };
