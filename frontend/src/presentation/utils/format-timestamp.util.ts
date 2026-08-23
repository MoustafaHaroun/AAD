import type { TFunction } from "i18next";

/**
 * Format a timestamp for a conversation list row: time-of-day if today,
 * otherwise a short relative "N days/weeks ago" string.
 * @param iso - The ISO timestamp to format.
 * @param t - The translation function.
 * @returns The formatted timestamp label.
 */
export function formatConversationTimestamp(iso: string, t: TFunction): string {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (days < 1) {
        return t("time.yesterday");
    }

    if (days < 7) {
        return t("time.daysAgo", { count: days });
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 5) {
        return t("time.weeksAgo", { count: weeks });
    }

    return date.toLocaleDateString();
}

/**
 * Format a timestamp for a date-divider inside a conversation thread.
 * @param iso - The ISO timestamp to format.
 * @returns The formatted date label.
 */
export function formatDateDivider(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long" });
}
