import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlRealBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlRealBuilder';
    constructor(name, config) {
        super(name, 'number', 'MySqlReal');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
    }
    /** @internal */
    build(table) {
        return new MySqlReal(table, this.config);
    }
}
export class MySqlReal extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlReal';
    precision = this.config.precision;
    scale = this.config.scale;
    getSQLType() {
        if (this.precision !== undefined && this.scale !== undefined) {
            return `real(${this.precision}, ${this.scale})`;
        }
        else if (this.precision === undefined) {
            return 'real';
        }
        else {
            return `real(${this.precision})`;
        }
    }
}
export function real(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlRealBuilder(name, config);
}
//# sourceMappingURL=real.js.map