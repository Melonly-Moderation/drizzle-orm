import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlFloatBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlFloatBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlFloat');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */
    build(table) {
        return new MySqlFloat(table, this.config);
    }
}
export class MySqlFloat extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlFloat';
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    getSQLType() {
        let type = '';
        if (this.precision !== undefined && this.scale !== undefined) {
            type += `float(${this.precision},${this.scale})`;
        }
        else if (this.precision === undefined) {
            type += 'float';
        }
        else {
            type += `float(${this.precision})`;
        }
        return this.unsigned ? `${type} unsigned` : type;
    }
}
export function float(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlFloatBuilder(name, config);
}
//# sourceMappingURL=float.js.map