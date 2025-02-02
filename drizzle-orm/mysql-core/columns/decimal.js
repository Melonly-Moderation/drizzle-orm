import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlDecimalBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlDecimalBuilder';
    constructor(name, config) {
        super(name, 'string', 'MySqlDecimal');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */
    build(table) {
        return new MySqlDecimal(table, this.config);
    }
}
export class MySqlDecimal extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlDecimal';
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    getSQLType() {
        let type = '';
        if (this.precision !== undefined && this.scale !== undefined) {
            type += `decimal(${this.precision},${this.scale})`;
        }
        else if (this.precision === undefined) {
            type += 'decimal';
        }
        else {
            type += `decimal(${this.precision})`;
        }
        type = type === 'decimal(10,0)' || type === 'decimal(10)' ? 'decimal' : type;
        return this.unsigned ? `${type} unsigned` : type;
    }
}
export function decimal(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlDecimalBuilder(name, config);
}
//# sourceMappingURL=decimal.js.map