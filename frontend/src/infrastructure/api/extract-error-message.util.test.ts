import { extractErrorMessage } from "@/infrastructure/api/extract-error-message.util";

describe("extractErrorMessage", () => {
    it("extracts a string message field", () => {
        expect(extractErrorMessage(JSON.stringify({ statusCode: 409, message: "Email already in use" }))).toBe("Email already in use");
    });

    it("joins an array of validation messages", () => {
        const body = JSON.stringify({ statusCode: 400, message: ["title must be longer than 3 characters", "description must be shorter than 255 characters"] });

        expect(extractErrorMessage(body)).toBe("title must be longer than 3 characters, description must be shorter than 255 characters");
    });

    it("returns null for a non-JSON body", () => {
        expect(extractErrorMessage("Internal Server Error")).toBeNull();
    });

    it("returns null when the body has no message field", () => {
        expect(extractErrorMessage(JSON.stringify({ statusCode: 500 }))).toBeNull();
    });

    it("returns null when message is neither a string nor a string array", () => {
        expect(extractErrorMessage(JSON.stringify({ message: 42 }))).toBeNull();
        expect(extractErrorMessage(JSON.stringify({ message: [1, 2, 3] }))).toBeNull();
    });
});
