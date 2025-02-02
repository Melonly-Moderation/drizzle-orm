import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgIntervalBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgIntervalBuilder';
    constructor(name, intervalConfig) {
        super(name, 'string', 'PgInterval');
        this.config.intervalConfig = intervalConfig;
    }
    /** @internal */
    build(table) {
        return new PgInterval(table, this.config);
    }
}
export class PgInterval extends PgColumn {
    static [entityKind] = 'PgInterval';
    fields = this.config.intervalConfig.fields;
    precision = this.config.intervalConfig.precision;
    getSQLType() {
        const fields = this.fields ? ` ${this.fields}` : '';
        const precision = this.precision ? `(${this.precision})` : '';
        return `interval${fields}${precision}`;
    }
}
export function interval(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgIntervalBuilder(name, config);
}
//# sourceMappingURL=interval.js.map