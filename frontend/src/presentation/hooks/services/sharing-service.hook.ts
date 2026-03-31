import { di } from "@/infrastructure/di";
import { type ISharingService, SHARING_SERVICE_TOKEN } from "@/domain/services";

/**
 * Use the sharing service.
 */
export function useSharingService(): ISharingService {
    return di.inject<ISharingService>(SHARING_SERVICE_TOKEN);
}
