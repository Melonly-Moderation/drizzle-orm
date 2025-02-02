import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgCidrBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgCidrBuilder';
    constructor(name) {
        super(name, 'string', 'PgCidr');
    }
    /** @internal */
    build(table) {
        return new PgCidr(table, this.config);
    }
}
export class PgCidr extends PgColumn {
    static [entityKind] = 'PgCidr';
    getSQLType() {
        return 'cidr';
    }
}
export function cidr(name) {
    return new PgCidrBuilder(name ?? '');
}
//# sourceMappingURL=cidr.js.map