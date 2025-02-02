import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlDoubleBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlDoubleBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlDouble');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */
    build(table) {
        return new MySqlDouble(table, this.config);
    }
}
export class MySqlDouble extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlDouble';
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    getSQLType() {
        let type = '';
        if (this.precision !== undefined && this.scale !== undefined) {
            type += `double(${this.precision},${this.scale})`;
        }
        else if (this.precision === undefined) {
            type += 'double';
        }
        else {
            type += `double(${this.precision})`;
        }
        return this.unsigned ? `${type} unsigned` : type;
    }
}
export function double(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlDoubleBuilder(name, config);
}
//# sourceMappingURL=double.js.map