import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgInetBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgInetBuilder';
    constructor(name) {
        super(name, 'string', 'PgInet');
    }
    /** @internal */
    build(table) {
        return new PgInet(table, this.config);
    }
}
export class PgInet extends PgColumn {
    static [entityKind] = 'PgInet';
    getSQLType() {
        return 'inet';
    }
}
export function inet(name) {
    return new PgInetBuilder(name ?? '');
}
//# sourceMappingURL=inet.js.map