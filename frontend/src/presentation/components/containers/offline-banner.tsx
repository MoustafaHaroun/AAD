import * as React from "react";
import { View } from "react-native";
import { WifiOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Icon } from "@/presentation/components/primitives/rnreusables/ui/icon";
import { Text } from "@/presentation/components/primitives/rnreusables/ui/text";
import { useNetworkStatus } from "@/presentation/hooks";

/**
 * Render a persistent banner while the device has no connection — the app
 * still shows the last-fetched data, but editing is disabled.
 * @returns The rendered banner, or null while online.
 */
export function OfflineBanner(): React.JSX.Element | null {
    const { t } = useTranslation();
    const isOnline = useNetworkStatus();

    if (isOnline) { return null; }

    return (
        <View className="flex-row items-center gap-2 bg-destructive px-4 py-2">
            <Icon
                as={WifiOff}
                className="size-4 text-white"
            />

            <Text className="flex-1 font-noto-medium text-[13px] text-white">
                {t("offline.banner")}
            </Text>
        </View>
    );
}
