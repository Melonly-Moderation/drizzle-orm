import { entityKind } from '~/entity.ts';
import { TableName } from '~/table.utils.ts';
export function unique(name) {
    return new UniqueOnConstraintBuilder(name);
}
export function uniqueKeyName(table, columns) {
    return `${table[TableName]}_${columns.join('_')}_unique`;
}
export class UniqueConstraintBuilder {
    name;
    static [entityKind] = 'MySqlUniqueConstraintBuilder';
    /** @internal */
    columns;
    constructor(columns, name) {
        this.name = name;
        this.columns = columns;
    }
    /** @internal */
    build(table) {
        return new UniqueConstraint(table, this.columns, this.name);
    }
}
export class UniqueOnConstraintBuilder {
    static [entityKind] = 'MySqlUniqueOnConstraintBuilder';
    /** @internal */
    name;
    constructor(name) {
        this.name = name;
    }
    on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
    }
}
export class UniqueConstraint {
    table;
    static [entityKind] = 'MySqlUniqueConstraint';
    columns;
    name;
    nullsNotDistinct = false;
    constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=unique-constraint.js.map