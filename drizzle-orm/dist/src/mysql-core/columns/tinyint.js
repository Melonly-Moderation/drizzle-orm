import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlTinyIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlTinyIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlTinyInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new MySqlTinyInt(table, this.config);
    }
}
export class MySqlTinyInt extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlTinyInt';
    getSQLType() {
        return `tinyint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function tinyint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTinyIntBuilder(name, config);
}
//# sourceMappingURL=tinyint.js.map