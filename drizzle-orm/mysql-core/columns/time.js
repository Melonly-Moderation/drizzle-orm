import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlTimeBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlTimeBuilder';
    constructor(name, config) {
        super(name, 'string', 'MySqlTime');
        this.config.fsp = config?.fsp;
    }
    /** @internal */
    build(table) {
        return new MySqlTime(table, this.config);
    }
}
export class MySqlTime extends MySqlColumn {
    static [entityKind] = 'MySqlTime';
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === undefined ? '' : `(${this.fsp})`;
        return `time${precision}`;
    }
}
export function time(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTimeBuilder(name, config);
}
//# sourceMappingURL=time.js.map