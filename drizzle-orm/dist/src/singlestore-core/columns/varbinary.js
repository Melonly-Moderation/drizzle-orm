import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreVarBinaryBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreVarBinaryBuilder';
    /** @internal */
    constructor(name, config) {
        super(name, 'string', 'SingleStoreVarBinary');
        this.config.length = config?.length;
    }
    /** @internal */
    build(table) {
        return new SingleStoreVarBinary(table, this.config);
    }
}
export class SingleStoreVarBinary extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreVarBinary';
    length = this.config.length;
    getSQLType() {
        return this.length === undefined ? `varbinary` : `varbinary(${this.length})`;
    }
}
export function varbinary(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreVarBinaryBuilder(name, config);
}
//# sourceMappingURL=varbinary.js.map