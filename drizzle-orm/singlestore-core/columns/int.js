import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new SingleStoreInt(table, this.config);
    }
}
export class SingleStoreInt extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreInt';
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
    return new SingleStoreIntBuilder(name, config);
}
//# sourceMappingURL=int.js.map