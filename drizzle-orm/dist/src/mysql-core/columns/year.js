import { entityKind } from '~/entity.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlYearBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlYearBuilder';
    constructor(name) {
        super(name, 'number', 'MySqlYear');
    }
    /** @internal */
    build(table) {
        return new MySqlYear(table, this.config);
    }
}
export class MySqlYear extends MySqlColumn {
    static [entityKind] = 'MySqlYear';
    getSQLType() {
        return `year`;
    }
}
export function year(name) {
    return new MySqlYearBuilder(name ?? '');
}
//# sourceMappingURL=year.js.map