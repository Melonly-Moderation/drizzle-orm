import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn } from './common.ts';
import { PgDateColumnBaseBuilder } from './date.common.ts';
export class PgTimeBuilder extends PgDateColumnBaseBuilder {
    withTimezone;
    precision;
    static [entityKind] = 'PgTimeBuilder';
    constructor(name, withTimezone, precision) {
        super(name, 'string', 'PgTime');
        this.withTimezone = withTimezone;
        this.precision = precision;
        this.config.withTimezone = withTimezone;
        this.config.precision = precision;
    }
    /** @internal */
    build(table) {
        return new PgTime(table, this.config);
    }
}
export class PgTime extends PgColumn {
    static [entityKind] = 'PgTime';
    withTimezone;
    precision;
    constructor(table, config) {
        super(table, config);
        this.withTimezone = config.withTimezone;
        this.precision = config.precision;
    }
    getSQLType() {
        const precision = this.precision === undefined ? '' : `(${this.precision})`;
        return `time${precision}${this.withTimezone ? ' with time zone' : ''}`;
    }
}
export function time(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}
//# sourceMappingURL=time.js.map