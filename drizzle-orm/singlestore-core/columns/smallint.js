import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreSmallIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreSmallIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreSmallInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new SingleStoreSmallInt(table, this.config);
    }
}
export class SingleStoreSmallInt extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreSmallInt';
    getSQLType() {
        return `smallint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function smallint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreSmallIntBuilder(name, config);
}
//# sourceMappingURL=smallint.js.map