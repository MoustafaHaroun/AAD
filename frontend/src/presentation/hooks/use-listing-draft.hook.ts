import { useEffect, useRef, useState } from "react";
import { listingDraftStore, type ListingDraft } from "@/infrastructure/persistence/drafts/listing-draft-store";

const SAVE_DEBOUNCE_MS = 500;

/**
 * Autosave in-progress create/edit listing form state locally (SQLite),
 * and restore it once on mount, so a draft survives an app kill or
 * accidental back-navigation.
 * @param id - `"new"` for the create-listing draft, or the listing's own id
 * for an edit-in-progress.
 * @returns The restored draft, whether it's finished loading, and functions to save/clear it.
 */
export function useListingDraft(id: string): {
    draft: ListingDraft | null,
    draftLoaded: boolean,
    saveDraft: (draft: ListingDraft) => void,
    clearDraft: () => void,
} {
    const [draft, setDraft] = useState<ListingDraft | null>(null);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;

        void listingDraftStore.get(id).then(stored => {
            if (!cancelled) {
                setDraft(stored);
                setDraftLoaded(true);
            }
        });

        return () => { cancelled = true; };
    }, [id]);

    /**
     * Debounced write — avoids hitting SQLite on every keystroke.
     * @param nextDraft - The draft state to persist.
     */
    function saveDraft(nextDraft: ListingDraft): void {
        if (timeoutRef.current != null) { clearTimeout(timeoutRef.current); }

        timeoutRef.current = setTimeout(() => {
            void listingDraftStore.set(id, nextDraft);
        }, SAVE_DEBOUNCE_MS);
    }

    /**
     * Discard the persisted draft, canceling any pending debounced save.
     */
    function clearDraft(): void {
        if (timeoutRef.current != null) { clearTimeout(timeoutRef.current); }

        void listingDraftStore.clear(id);
    }

    return { draft, draftLoaded, saveDraft, clearDraft };
}
