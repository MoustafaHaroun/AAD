import { di } from "@/infrastructure/di";
import { type ISharingService, SHARING_SERVICE_TOKEN } from "@/domain/services";

/**
 * Resolve the injected sharing service implementation.
 * @returns The sharing service.
 */
export function useSharingService(): ISharingService {
    return di.inject<ISharingService>(SHARING_SERVICE_TOKEN);
}
