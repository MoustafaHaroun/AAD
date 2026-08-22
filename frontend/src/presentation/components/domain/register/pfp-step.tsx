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
 *
 * @param root0
 * @param root0.avatarUri
 * @param root0.onPick
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
