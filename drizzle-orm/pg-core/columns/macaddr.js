import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgMacaddrBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgMacaddrBuilder';
    constructor(name) {
        super(name, 'string', 'PgMacaddr');
    }
    /** @internal */
    build(table) {
        return new PgMacaddr(table, this.config);
    }
}
export class PgMacaddr extends PgColumn {
    static [entityKind] = 'PgMacaddr';
    getSQLType() {
        return 'macaddr';
    }
}
export function macaddr(name) {
    return new PgMacaddrBuilder(name ?? '');
}
//# sourceMappingURL=macaddr.js.map