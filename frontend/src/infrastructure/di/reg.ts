import type { DIContainer } from "@/infrastructure/di";
import * as irepositories from "@/domain/repositories";
import * as iservices from "@/domain/services";
import {
    ListingRepository,
    AttachmentRepository,
    AuthHttpRepository,
    UserHttpRepository,
    FavoriteHttpRepository,
    ApiListingHttpRepository,
    MessageHttpRepository,
    NotificationHttpRepository,
} from "@/infrastructure/persistence/repositories";
import { ImageService, SharingService } from "@/infrastructure/services";

/**
 * Register implementations.
 * @param di - The DI container.
 */
export function register(di: DIContainer): void {
    registerRepositories(di);
    registerServices(di);
}

/**
 * Register repository implementations.
 * @param di - The DI container.
 */
function registerRepositories(di: DIContainer): void {
    di.provide(irepositories.LISTING_REPOSITORY_TOKEN, new ListingRepository());
    di.provide(irepositories.ATTACHMENT_REPOSITORY_TOKEN, new AttachmentRepository());
    di.provide(irepositories.AUTH_REPOSITORY_TOKEN, new AuthHttpRepository());
    di.provide(irepositories.USER_REPOSITORY_TOKEN, new UserHttpRepository());
    di.provide(irepositories.FAVORITE_REPOSITORY_TOKEN, new FavoriteHttpRepository());
    di.provide(irepositories.API_LISTING_REPOSITORY_TOKEN, new ApiListingHttpRepository());
    di.provide(irepositories.MESSAGE_REPOSITORY_TOKEN, new MessageHttpRepository());
    di.provide(irepositories.NOTIFICATION_REPOSITORY_TOKEN, new NotificationHttpRepository());
}

/**
 * Register service implementations.
 * @param di - The DI container.
 */
function registerServices(di: DIContainer): void {
    di.provide(iservices.IMAGE_SERVICE_TOKEN, new ImageService());
    di.provide(iservices.SHARING_SERVICE_TOKEN, new SharingService());
}
