/**
 * Base class for a single-method use case that executes with typed params and resolves a typed result.
 */
// eslint-disable-next-line typescript/no-empty-object-type
export abstract class UseCaseBase<T, P extends object = {}> {
    /**
     * Run the use case.
     * @param args - The use case's input parameters.
     * @returns The use case's result.
     */
    public abstract execute(args: P): Promise<T>;
}
