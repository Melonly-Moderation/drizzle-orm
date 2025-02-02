import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgJsonBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgJsonBuilder';
    constructor(name) {
        super(name, 'json', 'PgJson');
    }
    /** @internal */
    build(table) {
        return new PgJson(table, this.config);
    }
}
export class PgJson extends PgColumn {
    static [entityKind] = 'PgJson';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return 'json';
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
export function json(name) {
    return new PgJsonBuilder(name ?? '');
}
//# sourceMappingURL=json.js.map