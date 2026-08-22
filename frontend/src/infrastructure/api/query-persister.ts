import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const PERSIST_KEY = "trade2.query-cache";

/**
 * Persists the React Query cache to AsyncStorage so previously-loaded
 * listings, favorites, and profile data survive a full app restart while
 * offline — not just while the app stays open.
 */
export const queryPersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: PERSIST_KEY,
});
