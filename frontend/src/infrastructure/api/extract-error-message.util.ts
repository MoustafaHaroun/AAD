/**
 * Extract a user-facing message from an error response body.
 * @param text - The raw response body text.
 * @returns The backend's error message, joined if it's a validation-error array, or null if the body isn't in the expected shape.
 */
export function extractErrorMessage(text: string): string | null {
    try {
        const body: unknown = JSON.parse(text);
        const message = (body as { message?: unknown }).message;

        if (typeof message === "string") {
            return message;
        }

        if (Array.isArray(message) && message.every(entry => typeof entry === "string")) {
            return message.join(", ");
        }
    } catch (error) {
        console.log(error); // eslint-disable-line no-console
    }

    return null;
}
