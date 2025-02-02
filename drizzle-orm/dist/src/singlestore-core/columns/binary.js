import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreBinaryBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreBinaryBuilder';
    constructor(name, length) {
        super(name, 'string', 'SingleStoreBinary');
        this.config.length = length;
    }
    /** @internal */
    build(table) {
        return new SingleStoreBinary(table, this.config);
    }
}
export class SingleStoreBinary extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreBinary';
    length = this.config.length;
    getSQLType() {
        return this.length === undefined ? `binary` : `binary(${this.length})`;
    }
}
export function binary(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreBinaryBuilder(name, config.length);
}
//# sourceMappingURL=binary.js.map