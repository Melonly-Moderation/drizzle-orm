import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlSmallIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlSmallIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlSmallInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new MySqlSmallInt(table, this.config);
    }
}
export class MySqlSmallInt extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlSmallInt';
    getSQLType() {
        return `smallint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function smallint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlSmallIntBuilder(name, config);
}
//# sourceMappingURL=smallint.js.map