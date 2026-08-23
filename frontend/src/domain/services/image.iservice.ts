export const IMAGE_SERVICE_TOKEN = Symbol("IImageService");

export interface IImageService {
    /**
     * Select an image from the device's photo library.
     * @returns The picked image's local URI, or null if permission was denied or the picker was canceled.
     */
    pickImageFromGallery: () => Promise<string | null>,

    /**
     * Capture a photo with the device's camera.
     * @returns The captured photo's local URI, or null if permission was denied or capture was canceled.
     */
    takePhoto: () => Promise<string | null>,

    /**
     * Ask the user to choose between the camera and the photo library, then get an image from that source.
     * @returns The picked/captured image's local URI, or null if the user canceled at any point.
     */
    pickImage: () => Promise<string | null>,
}
