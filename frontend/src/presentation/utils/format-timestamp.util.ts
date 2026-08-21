/**
 * Formats a timestamp for a conversation list row: time-of-day if today,
 * otherwise a short relative "N days/weeks ago" string.
 * @param iso
 */
export function formatConversationTimestamp(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (days < 1) { return "Yesterday"; }
    if (days < 7) { return `${days} day${days === 1 ? "" : "s"} ago`; }

    const weeks = Math.floor(days / 7);

    if (weeks < 5) { return `${weeks} week${weeks === 1 ? "" : "s"} ago`; }

    return date.toLocaleDateString();
}

/**
 * Formats a timestamp for a date-divider inside a conversation thread.
 * @param iso
 */
export function formatDateDivider(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long" });
}
