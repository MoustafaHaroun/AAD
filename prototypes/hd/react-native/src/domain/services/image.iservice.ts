export const IMAGE_SERVICE_TOKEN = Symbol("IImageService");

export interface IImageService {
    /**
     * Prompts the user to select an image from the gallery.
     * Returns the temporary URI of the selected image, or null if cancelled.
     */
    pickImageFromGallery: () => Promise<string | null>,

    /**
     * Prompts the user to take a photo using the camera.
     * Returns the temporary URI of the taken photo, or null if cancelled.
     */
    takePhoto: () => Promise<string | null>,

    /**
     * Saves an image URI to the app's local storage (documentDirectory).
     * Returns the new persistent URI of the saved image.
     */
    saveImageLocally: (uri: string) => Promise<string>,

    deleteLocalImage: (uri: string) => Promise<string | null>,
}
