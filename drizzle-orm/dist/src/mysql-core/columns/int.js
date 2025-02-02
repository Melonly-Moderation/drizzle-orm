import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new MySqlInt(table, this.config);
    }
}
export class MySqlInt extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlInt';
    getSQLType() {
        return `int${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function int(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlIntBuilder(name, config);
}
//# sourceMappingURL=int.js.map