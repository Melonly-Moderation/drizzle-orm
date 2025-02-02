import { entityKind } from '~/entity.ts';
import { PgColumn } from './common.ts';
import { PgIntColumnBaseBuilder } from './int.common.ts';
export class PgSmallIntBuilder extends PgIntColumnBaseBuilder {
    static [entityKind] = 'PgSmallIntBuilder';
    constructor(name) {
        super(name, 'number', 'PgSmallInt');
    }
    /** @internal */
    build(table) {
        return new PgSmallInt(table, this.config);
    }
}
export class PgSmallInt extends PgColumn {
    static [entityKind] = 'PgSmallInt';
    getSQLType() {
        return 'smallint';
    }
    mapFromDriverValue = (value) => {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    };
}
export function smallint(name) {
    return new PgSmallIntBuilder(name ?? '');
}
//# sourceMappingURL=smallint.js.map