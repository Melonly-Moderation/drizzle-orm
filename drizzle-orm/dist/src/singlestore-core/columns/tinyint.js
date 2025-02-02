import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreTinyIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreTinyIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreTinyInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new SingleStoreTinyInt(table, this.config);
    }
}
export class SingleStoreTinyInt extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreTinyInt';
    getSQLType() {
        return `tinyint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function tinyint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreTinyIntBuilder(name, config);
}
//# sourceMappingURL=tinyint.js.map