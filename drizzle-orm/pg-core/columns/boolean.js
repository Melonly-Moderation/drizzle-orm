import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgBooleanBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgBooleanBuilder';
    constructor(name) {
        super(name, 'boolean', 'PgBoolean');
    }
    /** @internal */
    build(table) {
        return new PgBoolean(table, this.config);
    }
}
export class PgBoolean extends PgColumn {
    static [entityKind] = 'PgBoolean';
    getSQLType() {
        return 'boolean';
    }
}
export function boolean(name) {
    return new PgBooleanBuilder(name ?? '');
}
//# sourceMappingURL=boolean.js.map