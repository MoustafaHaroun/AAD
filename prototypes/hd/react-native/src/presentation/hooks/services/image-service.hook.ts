import { di } from "@/infrastructure/di";
import { type IImageService, IMAGE_SERVICE_TOKEN } from "@/domain/services";

/**
 * Use the image service.
 */
export function useImageService(): IImageService {
    return di.inject<IImageService>(IMAGE_SERVICE_TOKEN);
}
