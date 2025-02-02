import { entityKind } from '~/entity.ts';
import { PgColumn } from './common.ts';
import { PgIntColumnBaseBuilder } from './int.common.ts';
export class PgIntegerBuilder extends PgIntColumnBaseBuilder {
    static [entityKind] = 'PgIntegerBuilder';
    constructor(name) {
        super(name, 'number', 'PgInteger');
    }
    /** @internal */
    build(table) {
        return new PgInteger(table, this.config);
    }
}
export class PgInteger extends PgColumn {
    static [entityKind] = 'PgInteger';
    getSQLType() {
        return 'integer';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number.parseInt(value);
        }
        return value;
    }
}
export function integer(name) {
    return new PgIntegerBuilder(name ?? '');
}
//# sourceMappingURL=integer.js.map