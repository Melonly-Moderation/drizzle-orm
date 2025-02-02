import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlMediumIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlMediumIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlMediumInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new MySqlMediumInt(table, this.config);
    }
}
export class MySqlMediumInt extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlMediumInt';
    getSQLType() {
        return `mediumint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function mediumint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlMediumIntBuilder(name, config);
}
//# sourceMappingURL=mediumint.js.map