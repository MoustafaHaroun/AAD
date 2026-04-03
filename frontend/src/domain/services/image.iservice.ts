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
}
