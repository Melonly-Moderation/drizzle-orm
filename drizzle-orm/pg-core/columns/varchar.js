import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgVarcharBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgVarcharBuilder';
    constructor(name, config) {
        super(name, 'string', 'PgVarchar');
        this.config.length = config.length;
        this.config.enumValues = config.enum;
    }
    /** @internal */
    build(table) {
        return new PgVarchar(table, this.config);
    }
}
export class PgVarchar extends PgColumn {
    static [entityKind] = 'PgVarchar';
    length = this.config.length;
    enumValues = this.config.enumValues;
    getSQLType() {
        return this.length === undefined ? `varchar` : `varchar(${this.length})`;
    }
}
export function varchar(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgVarcharBuilder(name, config);
}
//# sourceMappingURL=varchar.js.map