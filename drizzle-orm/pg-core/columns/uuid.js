import { entityKind } from '~/entity.ts';
import { sql } from '~/sql/sql.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgUUIDBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgUUIDBuilder';
    constructor(name) {
        super(name, 'string', 'PgUUID');
    }
    /**
     * Adds `default gen_random_uuid()` to the column definition.
     */
    defaultRandom() {
        return this.default(sql `gen_random_uuid()`);
    }
    /** @internal */
    build(table) {
        return new PgUUID(table, this.config);
    }
}
export class PgUUID extends PgColumn {
    static [entityKind] = 'PgUUID';
    getSQLType() {
        return 'uuid';
    }
}
export function uuid(name) {
    return new PgUUIDBuilder(name ?? '');
}
//# sourceMappingURL=uuid.js.map