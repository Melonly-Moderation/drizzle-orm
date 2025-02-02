import { entityKind } from '~/entity.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlJsonBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlJsonBuilder';
    constructor(name) {
        super(name, 'json', 'MySqlJson');
    }
    /** @internal */
    build(table) {
        return new MySqlJson(table, this.config);
    }
}
export class MySqlJson extends MySqlColumn {
    static [entityKind] = 'MySqlJson';
    getSQLType() {
        return 'json';
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
}
export function json(name) {
    return new MySqlJsonBuilder(name ?? '');
}
//# sourceMappingURL=json.js.map