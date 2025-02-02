import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlBinaryBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlBinaryBuilder';
    constructor(name, length) {
        super(name, 'string', 'MySqlBinary');
        this.config.length = length;
    }
    /** @internal */
    build(table) {
        return new MySqlBinary(table, this.config);
    }
}
export class MySqlBinary extends MySqlColumn {
    static [entityKind] = 'MySqlBinary';
    length = this.config.length;
    getSQLType() {
        return this.length === undefined ? `binary` : `binary(${this.length})`;
    }
}
export function binary(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlBinaryBuilder(name, config.length);
}
//# sourceMappingURL=binary.js.map