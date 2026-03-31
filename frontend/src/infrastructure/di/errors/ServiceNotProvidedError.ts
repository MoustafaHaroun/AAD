export class ServiceNotProvidedError extends Error {
    constructor(serviceName: string) {
        super(`Service "${serviceName}" is not provided.`);
        this.name = "ServiceNotProvidedError";
    }
}
