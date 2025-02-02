import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlDateTimeBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlDateTimeBuilder';
    constructor(name, config) {
        super(name, 'date', 'MySqlDateTime');
        this.config.fsp = config?.fsp;
    }
    /** @internal */
    build(table) {
        return new MySqlDateTime(table, this.config);
    }
}
export class MySqlDateTime extends MySqlColumn {
    static [entityKind] = 'MySqlDateTime';
    fsp;
    constructor(table, config) {
        super(table, config);
        this.fsp = config.fsp;
    }
    getSQLType() {
        const precision = this.fsp === undefined ? '' : `(${this.fsp})`;
        return `datetime${precision}`;
    }
    mapToDriverValue(value) {
        return value.toISOString().replace('T', ' ').replace('Z', '');
    }
    mapFromDriverValue(value) {
        return new Date(value.replace(' ', 'T') + 'Z');
    }
}
export class MySqlDateTimeStringBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlDateTimeStringBuilder';
    constructor(name, config) {
        super(name, 'string', 'MySqlDateTimeString');
        this.config.fsp = config?.fsp;
    }
    /** @internal */
    build(table) {
        return new MySqlDateTimeString(table, this.config);
    }
}
export class MySqlDateTimeString extends MySqlColumn {
    static [entityKind] = 'MySqlDateTimeString';
    fsp;
    constructor(table, config) {
        super(table, config);
        this.fsp = config.fsp;
    }
    getSQLType() {
        const precision = this.fsp === undefined ? '' : `(${this.fsp})`;
        return `datetime${precision}`;
    }
}
export function datetime(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new MySqlDateTimeStringBuilder(name, config);
    }
    return new MySqlDateTimeBuilder(name, config);
}
//# sourceMappingURL=datetime.js.map