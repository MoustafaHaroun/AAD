import { ServiceAlreadyProvidedError } from "@/infrastructure/di/errors/ServiceAlreadyProvidedError";
import { ServiceNotProvidedError } from "@/infrastructure/di/errors/ServiceNotProvidedError";
import { register } from "@/infrastructure/di/reg";

export class DIContainer {
    private services = new Map<symbol, unknown>();

    /**
     * Provide a service instance to the container.
     * @param token - The token used to identify the service.
     * @param instance - The instance of the service.
     * @throws {ServiceAlreadyProvidedError} If the service is already provided in the container.
     */
    public provide<T>(token: symbol, instance: T): void {
        if (this.services.has(token)) {
            throw new ServiceAlreadyProvidedError(token.description ?? "Unknown service");
        }

        this.services.set(token, instance);
    }

    /**
     * Provide multiple service instances to the container.
     * @param entries - A map of tokens to instances.
     */
    public provideAll(entries: Map<symbol, unknown>): void {
        for (const [token, instance] of entries) {
            this.provide(token, instance);
        }
    }

    /**
     * Inject a service instance from the container.
     * @param token - The token used to identify the service.
     * @returns The instance of the service.
     * @throws {ServiceNotProvidedError} If the service is not provided in the container.
     */
    public inject<T>(token: symbol): T {
        const instance = this.services.get(token);

        if (instance == null) {
            throw new ServiceNotProvidedError(token.description ?? "Unknown service");
        }

        return instance as T;
    }
}

export const di = new DIContainer();

register(di);

export {
    ServiceNotProvidedError,
    ServiceAlreadyProvidedError,
};

export { UseCaseBase } from "@/infrastructure/di/base/UseCaseBase";
