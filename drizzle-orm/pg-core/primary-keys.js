import { entityKind } from '~/entity.ts';
import { PgTable } from './table.ts';
export function primaryKey(...config) {
    if (config[0].columns) {
        return new PrimaryKeyBuilder(config[0].columns, config[0].name);
    }
    return new PrimaryKeyBuilder(config);
}
export class PrimaryKeyBuilder {
    static [entityKind] = 'PgPrimaryKeyBuilder';
    /** @internal */
    columns;
    /** @internal */
    name;
    constructor(columns, name) {
        this.columns = columns;
        this.name = name;
    }
    /** @internal */
    build(table) {
        return new PrimaryKey(table, this.columns, this.name);
    }
}
export class PrimaryKey {
    table;
    static [entityKind] = 'PgPrimaryKey';
    columns;
    name;
    constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
    }
    getName() {
        return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join('_')}_pk`;
    }
}
//# sourceMappingURL=primary-keys.js.map