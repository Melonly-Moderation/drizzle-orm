import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlDateBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlDateBuilder';
    constructor(name) {
        super(name, 'date', 'MySqlDate');
    }
    /** @internal */
    build(table) {
        return new MySqlDate(table, this.config);
    }
}
export class MySqlDate extends MySqlColumn {
    static [entityKind] = 'MySqlDate';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
    mapFromDriverValue(value) {
        return new Date(value);
    }
}
export class MySqlDateStringBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlDateStringBuilder';
    constructor(name) {
        super(name, 'string', 'MySqlDateString');
    }
    /** @internal */
    build(table) {
        return new MySqlDateString(table, this.config);
    }
}
export class MySqlDateString extends MySqlColumn {
    static [entityKind] = 'MySqlDateString';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
}
export function date(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new MySqlDateStringBuilder(name);
    }
    return new MySqlDateBuilder(name);
}
//# sourceMappingURL=date.js.map