import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreCharBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreCharBuilder';
    constructor(name, config) {
        super(name, 'string', 'SingleStoreChar');
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */
    build(table) {
        return new SingleStoreChar(table, this.config);
    }
}
export class SingleStoreChar extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreChar';
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === undefined ? `char` : `char(${this.length})`;
    }
}
export function char(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreCharBuilder(name, config);
}
//# sourceMappingURL=char.js.map