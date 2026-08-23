import { haversineDistanceKm, formatDistanceLabel } from "@/presentation/utils/distance.util";
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

describe("haversineDistanceKm", () => {
    it("returns 0 for identical coordinates", () => {
        expect(haversineDistanceKm(52.2215, 6.8937, 52.2215, 6.8937)).toBeCloseTo(0);
    });

    it("returns the known distance between two real cities", () => {
        // Enschede to Amsterdam, roughly 140km apart.
        const distance = haversineDistanceKm(52.2215, 6.8937, 52.3676, 4.9041);

        expect(distance).toBeGreaterThan(130);
        expect(distance).toBeLessThan(150);
    });
});

describe("formatDistanceLabel", () => {
    it("returns undefined when the viewer's own location is unknown", () => {
        expect(formatDistanceLabel(t, {}, { latitude: 52.2215, longitude: 6.8937 })).toBeUndefined();
    });

    it("returns the unknown-distance label when the listing owner's location is unknown", () => {
        expect(formatDistanceLabel(t, { latitude: 52.2215, longitude: 6.8937 }, {})).toBe("listings.distanceUnknown");
    });

    it("returns a formatted distance when both locations are known", () => {
        const label = formatDistanceLabel(t, { latitude: 52.2215, longitude: 6.8937 }, { latitude: 52.3676, longitude: 4.9041 });

        expect(label).toContain("listings.distanceAway");
    });
});
