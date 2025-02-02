import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgDoublePrecisionBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgDoublePrecisionBuilder';
    constructor(name) {
        super(name, 'number', 'PgDoublePrecision');
    }
    /** @internal */
    build(table) {
        return new PgDoublePrecision(table, this.config);
    }
}
export class PgDoublePrecision extends PgColumn {
    static [entityKind] = 'PgDoublePrecision';
    getSQLType() {
        return 'double precision';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number.parseFloat(value);
        }
        return value;
    }
}
export function doublePrecision(name) {
    return new PgDoublePrecisionBuilder(name ?? '');
}
//# sourceMappingURL=double-precision.js.map