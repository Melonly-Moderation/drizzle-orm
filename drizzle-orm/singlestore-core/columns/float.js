import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreFloatBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreFloatBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreFloat');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */
    build(table) {
        return new SingleStoreFloat(table, this.config);
    }
}
export class SingleStoreFloat extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreFloat';
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
            type += `float(${this.precision},0)`;
        }
        return this.unsigned ? `${type} unsigned` : type;
    }
}
export function float(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreFloatBuilder(name, config);
}
//# sourceMappingURL=float.js.map