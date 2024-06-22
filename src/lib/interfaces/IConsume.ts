export interface IConsume<T, Args extends unknown[] = []> {
    successHandler(...args: Args): T;
    errorHandler(...args: Args): T;
}