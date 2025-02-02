import { entityKind } from '~/entity.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlBooleanBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlBooleanBuilder';
    constructor(name) {
        super(name, 'boolean', 'MySqlBoolean');
    }
    /** @internal */
    build(table) {
        return new MySqlBoolean(table, this.config);
    }
}
export class MySqlBoolean extends MySqlColumn {
    static [entityKind] = 'MySqlBoolean';
    getSQLType() {
        return 'boolean';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        return value === 1;
    }
}
export function boolean(name) {
    return new MySqlBooleanBuilder(name ?? '');
}
//# sourceMappingURL=boolean.js.map