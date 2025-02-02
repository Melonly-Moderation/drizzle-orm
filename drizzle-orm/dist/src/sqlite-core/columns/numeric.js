import { entityKind } from '~/entity.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export class SQLiteNumericBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteNumericBuilder';
    constructor(name) {
        super(name, 'string', 'SQLiteNumeric');
    }
    /** @internal */
    build(table) {
        return new SQLiteNumeric(table, this.config);
    }
}
export class SQLiteNumeric extends SQLiteColumn {
    static [entityKind] = 'SQLiteNumeric';
    getSQLType() {
        return 'numeric';
    }
}
export function numeric(name) {
    return new SQLiteNumericBuilder(name ?? '');
}
//# sourceMappingURL=numeric.js.map