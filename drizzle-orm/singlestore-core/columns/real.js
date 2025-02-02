import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreRealBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreRealBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreReal');
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
    }
    /** @internal */
    build(table) {
        return new SingleStoreReal(table, this.config);
    }
}
export class SingleStoreReal extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreReal';
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
    return new SingleStoreRealBuilder(name, config);
}
//# sourceMappingURL=real.js.map