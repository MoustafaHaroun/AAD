import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Live connectivity status. `true` while the device has a working internet
 * connection; `false` once NetInfo reports otherwise. Starts optimistic
 * (`true`) until the first event arrives.
 */
export function useNetworkStatus(): boolean {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
    }), []);

    return isOnline;
}
