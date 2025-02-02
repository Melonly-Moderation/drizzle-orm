import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlVarBinaryBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlVarBinaryBuilder';
    /** @internal */
    constructor(name, config) {
        super(name, 'string', 'MySqlVarBinary');
        this.config.length = config?.length;
    }
    /** @internal */
    build(table) {
        return new MySqlVarBinary(table, this.config);
    }
}
export class MySqlVarBinary extends MySqlColumn {
    static [entityKind] = 'MySqlVarBinary';
    length = this.config.length;
    getSQLType() {
        return this.length === undefined ? `varbinary` : `varbinary(${this.length})`;
    }
}
export function varbinary(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlVarBinaryBuilder(name, config);
}
//# sourceMappingURL=varbinary.js.map