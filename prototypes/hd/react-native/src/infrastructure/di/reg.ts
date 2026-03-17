import type { DIContainer } from "@/infrastructure/di";
import * as irepositories from "@/domain/repositories";
import * as iservices from "@/domain/services";
import { ListingRepository } from "@/infrastructure/persistence/repositories";
import { ImageService } from "@/infrastructure/services";

/**
 *
 * @param di
 */
export function register(di: DIContainer) {
    registerRepositories(di);
    registerServices(di);
}

/**
 *
 * @param di
 */
function registerRepositories(di: DIContainer) {
    di.provide(irepositories.LISTING_REPOSITORY_TOKEN, new ListingRepository());
}

/**
 *
 * @param di
 */
function registerServices(di: DIContainer) {
    di.provide(iservices.IMAGE_SERVICE_TOKEN, new ImageService());
}
