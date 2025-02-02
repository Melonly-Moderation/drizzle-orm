import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreDoubleBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreDoubleBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreDouble');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */
    build(table) {
        return new SingleStoreDouble(table, this.config);
    }
}
export class SingleStoreDouble extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreDouble';
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
    return new SingleStoreDoubleBuilder(name, config);
}
//# sourceMappingURL=double.js.map