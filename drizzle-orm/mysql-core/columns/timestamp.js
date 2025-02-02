import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder } from './date.common.ts';
export class MySqlTimestampBuilder extends MySqlDateColumnBaseBuilder {
    static [entityKind] = 'MySqlTimestampBuilder';
    constructor(name, config) {
        super(name, 'date', 'MySqlTimestamp');
        this.config.fsp = config?.fsp;
    }
    /** @internal */
    build(table) {
        return new MySqlTimestamp(table, this.config);
    }
}
export class MySqlTimestamp extends MySqlDateBaseColumn {
    static [entityKind] = 'MySqlTimestamp';
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === undefined ? '' : `(${this.fsp})`;
        return `timestamp${precision}`;
    }
    mapFromDriverValue(value) {
        return new Date(value + '+0000');
    }
    mapToDriverValue(value) {
        return value.toISOString().slice(0, -1).replace('T', ' ');
    }
}
export class MySqlTimestampStringBuilder extends MySqlDateColumnBaseBuilder {
    static [entityKind] = 'MySqlTimestampStringBuilder';
    constructor(name, config) {
        super(name, 'string', 'MySqlTimestampString');
        this.config.fsp = config?.fsp;
    }
    /** @internal */
    build(table) {
        return new MySqlTimestampString(table, this.config);
    }
}
export class MySqlTimestampString extends MySqlDateBaseColumn {
    static [entityKind] = 'MySqlTimestampString';
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === undefined ? '' : `(${this.fsp})`;
        return `timestamp${precision}`;
    }
}
export function timestamp(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new MySqlTimestampStringBuilder(name, config);
    }
    return new MySqlTimestampBuilder(name, config);
}
//# sourceMappingURL=timestamp.js.map