import { formatConversationTimestamp, formatDateDivider } from "@/presentation/utils/format-timestamp.util";
import type { TFunction } from "i18next";

/**
 * A stub translation function that returns the key, plus its interpolation options if any were given.
 * @param key - The translation key.
 * @param options - The interpolation options, if any.
 * @returns The stubbed translation.
 */
function stubT(key: string, options?: Record<string, unknown>): string {
    if (options == null) {
        return key;
    }

    return `${key}:${JSON.stringify(options)}`;
}

const t = stubT as unknown as TFunction;

// A fixed "now" late in the day (local time), so subtracting a few hours crosses into the previous calendar day.
const NOW = new Date(2026, 2, 10, 22, 0, 0);

/**
 * Build an ISO timestamp offset from the fixed "now" by the given number of hours.
 * @param hoursAgo - How many hours before "now" the timestamp should be.
 * @returns The ISO timestamp string.
 */
function hoursAgoIso(hoursAgo: number): string {
    return new Date(NOW.getTime() - (hoursAgo * 60 * 60 * 1000)).toISOString();
}

beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
});

afterEach(() => {
    jest.useRealTimers();
});

describe("formatConversationTimestamp", () => {
    it("returns a time-of-day string for a timestamp from today", () => {
        expect(formatConversationTimestamp(hoursAgoIso(1), t)).not.toContain("time.");
    });

    it("returns the yesterday label for a timestamp under 24 hours old but from the previous calendar day", () => {
        expect(formatConversationTimestamp(hoursAgoIso(23), t)).toBe("time.yesterday");
    });

    it("returns a days-ago label for a timestamp under a week old", () => {
        expect(formatConversationTimestamp(hoursAgoIso(3 * 24), t)).toContain("time.daysAgo");
    });

    it("returns a weeks-ago label for a timestamp under five weeks old", () => {
        expect(formatConversationTimestamp(hoursAgoIso(14 * 24), t)).toContain("time.weeksAgo");
    });

    it("returns a plain date for a timestamp older than five weeks", () => {
        const label = formatConversationTimestamp(hoursAgoIso(60 * 24), t);

        expect(label).not.toContain("time.");
    });
});

describe("formatDateDivider", () => {
    it("formats an ISO timestamp as a day and month, without a year", () => {
        const label = formatDateDivider("2026-03-05T12:00:00.000Z");

        expect(label).toContain("5");
        expect(label).not.toContain("2026");
    });
});
