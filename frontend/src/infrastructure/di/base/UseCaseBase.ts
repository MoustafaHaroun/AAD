export abstract class UseCaseBase<T, P extends object = {}> {
    abstract execute(args: P): Promise<T>;
}
