import { useEffect } from "react";
import * as Location from "expo-location";
import { useCurrentUserId } from "@/presentation/hooks/queries/current-user.hook";
import { useGetUser } from "@/presentation/hooks/queries/get-user.hook";
import { useUpdateUser } from "@/presentation/hooks/mutations/update-user.hook";

/**
 * Requests foreground location permission and, once granted, persists the
 * device's current coordinates to the user's profile so listing distances
 * can be computed. No-ops silently if permission is denied.
 */
export function useSyncUserLocation(): void {
    const currentUserId = useCurrentUserId();
    const { data: user } = useGetUser(currentUserId ?? "");
    const { mutate: updateUser } = useUpdateUser();

    useEffect(() => {
        if (currentUserId == null || user == null) { return; }

        void (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== Location.PermissionStatus.GRANTED) { return; }

            const position = await Location.getCurrentPositionAsync({});

            updateUser({
                id: currentUserId,
                body: { latitude: position.coords.latitude, longitude: position.coords.longitude },
            });
        })();
    }, [currentUserId, user == null]);
}
