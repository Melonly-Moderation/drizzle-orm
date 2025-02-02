import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlVarCharBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlVarCharBuilder';
    /** @internal */
    constructor(name, config) {
        super(name, 'string', 'MySqlVarChar');
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */
    build(table) {
        return new MySqlVarChar(table, this.config);
    }
}
export class MySqlVarChar extends MySqlColumn {
    static [entityKind] = 'MySqlVarChar';
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === undefined ? `varchar` : `varchar(${this.length})`;
    }
}
export function varchar(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlVarCharBuilder(name, config);
}
//# sourceMappingURL=varchar.js.map