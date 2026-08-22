import type { TFunction } from "i18next";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function haversineDistanceKm(fromLat: number, fromLon: number, toLat: number, toLon: number): number {
    const dLat = toRadians(toLat - fromLat);
    const dLon = toRadians(toLon - fromLon);

    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLon / 2) ** 2;

    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Coordinates {
    latitude?: number | null,
    longitude?: number | null,
}

/**
 * Formats the distance from the current user to a listing owner, or undefined
 * if the current user's own location isn't known yet (in which case nothing
 * should be shown, rather than a misleading "unknown" for every listing).
 */
export function formatDistanceLabel(t: TFunction, from: Coordinates, to: Coordinates): string | undefined {
    if (from.latitude == null || from.longitude == null) { return undefined; }

    if (to.latitude == null || to.longitude == null) { return t("listings.distanceUnknown"); }

    const distance = haversineDistanceKm(from.latitude, from.longitude, to.latitude, to.longitude);

    return t("listings.distanceAway", { distance: distance.toFixed(1) });
}
