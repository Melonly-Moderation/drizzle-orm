import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgJsonbBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgJsonbBuilder';
    constructor(name) {
        super(name, 'json', 'PgJsonb');
    }
    /** @internal */
    build(table) {
        return new PgJsonb(table, this.config);
    }
}
export class PgJsonb extends PgColumn {
    static [entityKind] = 'PgJsonb';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return 'jsonb';
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        return value;
    }
}
export function jsonb(name) {
    return new PgJsonbBuilder(name ?? '');
}
//# sourceMappingURL=jsonb.js.map