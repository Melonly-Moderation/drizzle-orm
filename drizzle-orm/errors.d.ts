export declare class DrizzleError extends Error {
    static readonly [x: number]: string;
    constructor({ message, cause }: {
        message?: string;
        cause?: unknown;
    });
}
export declare class TransactionRollbackError extends DrizzleError {
    static readonly [x: number]: string;
    constructor();
}
