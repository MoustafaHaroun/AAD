import { canManageListing } from "@/presentation/utils/listing-permissions.util";
import type { ApiListing } from "@/domain/entities";

const OWNER_ID = "owner-1";
const OTHER_USER_ID = "other-1";

const listing: ApiListing = {
    id: "listing-1",
    title: "A listing",
    user: { id: OWNER_ID, email: "owner@example.com", firstname: "Owner", surname: "User" },
};

describe("canManageListing", () => {
    it("allows the listing's owner", () => {
        expect(canManageListing(listing, OWNER_ID, "user")).toBe(true);
    });

    it("allows an admin who does not own the listing", () => {
        expect(canManageListing(listing, OTHER_USER_ID, "admin")).toBe(true);
    });

    it("denies a regular user who does not own the listing", () => {
        expect(canManageListing(listing, OTHER_USER_ID, "user")).toBe(false);
    });

    it("denies a signed-out viewer", () => {
        expect(canManageListing(listing, null, undefined)).toBe(false);
    });

    it("denies when the listing has not loaded yet", () => {
        expect(canManageListing(undefined, OWNER_ID, "admin")).toBe(false);
    });
});
