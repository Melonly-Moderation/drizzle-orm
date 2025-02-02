import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreMediumIntBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreMediumIntBuilder';
    constructor(name, config) {
        super(name, 'number', 'SingleStoreMediumInt');
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */
    build(table) {
        return new SingleStoreMediumInt(table, this.config);
    }
}
export class SingleStoreMediumInt extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreMediumInt';
    getSQLType() {
        return `mediumint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function mediumint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreMediumIntBuilder(name, config);
}
//# sourceMappingURL=mediumint.js.map