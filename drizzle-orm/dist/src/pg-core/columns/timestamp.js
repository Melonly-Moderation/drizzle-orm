import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn } from './common.ts';
import { PgDateColumnBaseBuilder } from './date.common.ts';
export class PgTimestampBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = 'PgTimestampBuilder';
    constructor(name, withTimezone, precision) {
        super(name, 'date', 'PgTimestamp');
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
    }
    /** @internal */
    build(table) {
        return new PgTimestamp(table, this.config);
    }
}
export class PgTimestamp extends PgColumn {
    static [entityKind] = 'PgTimestamp';
    withTimezone;
    precision;
    constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision = this.precision === undefined ? '' : ` (${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? ' with time zone' : ''}`;
    }
    mapFromDriverValue = (value) => {
        return new Date(this.withTimezone ? value : value + '+0000');
    };
    mapToDriverValue = (value) => {
        return value.toISOString();
    };
}
export class PgTimestampStringBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = 'PgTimestampStringBuilder';
    constructor(name, withTimezone, precision) {
        super(name, 'string', 'PgTimestampString');
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
    }
    /** @internal */
    build(table) {
        return new PgTimestampString(table, this.config);
    }
}
export class PgTimestampString extends PgColumn {
    static [entityKind] = 'PgTimestampString';
    withTimezone;
    precision;
    constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision = this.precision === undefined ? '' : `(${this.precision})`;
        return `timestamp${precision}${this.withTimezone ? ' with time zone' : ''}`;
    }
}
export function timestamp(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
    }
    return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}
//# sourceMappingURL=timestamp.js.map