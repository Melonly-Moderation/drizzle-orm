import { entityKind } from '~/entity.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export class SQLiteRealBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteRealBuilder';
    constructor(name) {
        super(name, 'number', 'SQLiteReal');
    }
    /** @internal */
    build(table) {
        return new SQLiteReal(table, this.config);
    }
}
export class SQLiteReal extends SQLiteColumn {
    static [entityKind] = 'SQLiteReal';
    getSQLType() {
        return 'real';
    }
}
export function real(name) {
    return new SQLiteRealBuilder(name ?? '');
}
//# sourceMappingURL=real.js.map