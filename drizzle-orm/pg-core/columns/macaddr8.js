import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgMacaddr8Builder extends PgColumnBuilder {
    static [entityKind] = 'PgMacaddr8Builder';
    constructor(name) {
        super(name, 'string', 'PgMacaddr8');
    }
    /** @internal */
    build(table) {
        return new PgMacaddr8(table, this.config);
    }
}
export class PgMacaddr8 extends PgColumn {
    static [entityKind] = 'PgMacaddr8';
    getSQLType() {
        return 'macaddr8';
    }
}
export function macaddr8(name) {
    return new PgMacaddr8Builder(name ?? '');
}
//# sourceMappingURL=macaddr8.js.map