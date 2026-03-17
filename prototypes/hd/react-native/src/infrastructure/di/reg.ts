import type { DIContainer } from "@/infrastructure/di";
import * as irepositories from "@/domain/repositories";
import * as iservices from "@/domain/services";
import { ListingRepository, AttachmentRepository } from "@/infrastructure/persistence/repositories";
import { ImageService } from "@/infrastructure/services";

/**
 * Register implementations.
 * @param di - The DI container.
 */
export function register(di: DIContainer) {
    registerRepositories(di);
    registerServices(di);
}

/**
 * Register repository implementations.
 * @param di - The DI container.
 */
function registerRepositories(di: DIContainer) {
    di.provide(irepositories.LISTING_REPOSITORY_TOKEN, new ListingRepository());
    di.provide(irepositories.ATTACHMENT_REPOSITORY_TOKEN, new AttachmentRepository());
}

/**
 * Register service implementations.
 * @param di - The DI container.
 */
function registerServices(di: DIContainer) {
    di.provide(iservices.IMAGE_SERVICE_TOKEN, new ImageService());
}
