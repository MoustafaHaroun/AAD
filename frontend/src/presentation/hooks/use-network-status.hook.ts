import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Track live device connectivity status. Starts optimistic (`true`) until
 * the first NetInfo event arrives.
 * @returns `true` while the device has a working internet connection.
 */
export function useNetworkStatus(): boolean {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    }), []);

    return isOnline;
}
