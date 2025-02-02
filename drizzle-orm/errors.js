import { entityKind } from '~/entity.ts';
export class DrizzleError extends Error {
    static [entityKind] = 'DrizzleError';
    constructor({ message, cause }) {
        super(message);
        this.name = 'DrizzleError';
        this.cause = cause;
    }
}
export class TransactionRollbackError extends DrizzleError {
    static [entityKind] = 'TransactionRollbackError';
    constructor() {
        super({ message: 'Rollback' });
    }
}
//# sourceMappingURL=errors.js.map