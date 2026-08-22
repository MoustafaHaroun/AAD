import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { PersistedClient } from "@tanstack/query-persist-client-core";

// Bumping this key orphans any snapshot written under the old key — used
// Once already to discard a bad cache saved during the blocking-restore bug.
const PERSIST_KEY = "trade2.query-cache.v2";
const RESTORE_TIMEOUT_MS = 3000;

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    key: PERSIST_KEY,
});

/**
 * Persists the React Query cache to AsyncStorage so previously-loaded
 * listings, favorites, and profile data survive a full app restart while
 * offline — not just while the app stays open. Restored/saved in the
 * background (see layout.tsx); no query ever waits on this.
 *
 * The timeout guards against a hung AsyncStorage call (e.g. a native module
 * not yet linked into the running build) leaving the restore promise
 * unresolved forever.
 */
export const queryPersister = {
    ...asyncStoragePersister,

    /**
     * Restore the persisted query cache, giving up after a timeout.
     * @returns The persisted client snapshot, or undefined if none was found or the restore timed out.
     */
    restoreClient: async (): Promise<PersistedClient | undefined> => Promise.race([
        asyncStoragePersister.restoreClient(),
        new Promise<undefined>(resolve => {
            setTimeout(() => { resolve(undefined); }, RESTORE_TIMEOUT_MS);
        }),
    ]),
};
