import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreVarCharBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreVarCharBuilder';
    /** @internal */
    constructor(name, config) {
        super(name, 'string', 'SingleStoreVarChar');
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */
    build(table) {
        return new SingleStoreVarChar(table, this.config);
    }
}
export class SingleStoreVarChar extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreVarChar';
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === undefined ? `varchar` : `varchar(${this.length})`;
    }
}
export function varchar(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreVarCharBuilder(name, config);
}
//# sourceMappingURL=varchar.js.map