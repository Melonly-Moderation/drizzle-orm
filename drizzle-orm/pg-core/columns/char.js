import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgCharBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgCharBuilder';
    constructor(name, config) {
        super(name, 'string', 'PgChar');
        this.config.length = config.length;
        this.config.enumValues = config.enum;
    }
    /** @internal */
    build(table) {
        return new PgChar(table, this.config);
    }
}
export class PgChar extends PgColumn {
    static [entityKind] = 'PgChar';
    length = this.config.length;
    enumValues = this.config.enumValues;
    getSQLType() {
        return this.length === undefined ? `char` : `char(${this.length})`;
    }
}
export function char(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgCharBuilder(name, config);
}
//# sourceMappingURL=char.js.map