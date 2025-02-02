import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlCharBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlCharBuilder';
    constructor(name, config) {
        super(name, 'string', 'MySqlChar');
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */
    build(table) {
        return new MySqlChar(table, this.config);
    }
}
export class MySqlChar extends MySqlColumn {
    static [entityKind] = 'MySqlChar';
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === undefined ? `char` : `char(${this.length})`;
    }
}
export function char(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlCharBuilder(name, config);
}
//# sourceMappingURL=char.js.map