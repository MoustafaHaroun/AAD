import * as React from "react";
import { Image, Pressable, View } from "react-native";
import { Plus, User as UserIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";

interface PfpStepProps {
    readonly avatarUri: string | null,
    readonly onPick: () => void,
}

/**
 * Render the profile-picture step of the registration wizard.
 * @param props - The props.
 * @param props.avatarUri - The locally picked avatar image URI, or null if none picked yet.
 * @param props.onPick - Called when the avatar circle is pressed, to open the image picker.
 * @returns The rendered step content.
 */
export function PfpStep({ avatarUri, onPick }: PfpStepProps): React.JSX.Element {
    const { t } = useTranslation();

    return (
        <View className="items-center">
            <Text className="mb-3 text-[16px] font-noto-semibold text-black">{t("register.pfp.title")}</Text>

            <Pressable
                className="relative"
                onPress={onPick}
            >
                <View className="size-[100px] items-center justify-center overflow-hidden rounded-full bg-muted">
                    {avatarUri != null
                        ? <Image
                                className="size-full"
                                source={{ uri: avatarUri }}
                            />
                        : <Icon
                                as={UserIcon}
                                className="size-14 text-muted-foreground"
                            />}
                </View>

                <View className="absolute bottom-0 right-0 size-8 items-center justify-center rounded-full bg-forehued">
                    <Icon
                        as={Plus}
                        className="size-5 text-white"
                    />
                </View>
            </Pressable>
        </View>
    );
}
