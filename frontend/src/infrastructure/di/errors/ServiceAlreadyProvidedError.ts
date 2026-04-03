export class ServiceAlreadyProvidedError extends Error {
    constructor(serviceName: string) {
        super(`Service "${serviceName}" is already provided.`);
        this.name = "ServiceAlreadyProvidedError";
    }
}
