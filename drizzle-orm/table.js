import { entityKind } from './entity.ts';
import { TableName } from './table.utils.ts';
/** @internal */
export const Schema = Symbol.for('drizzle:Schema');
/** @internal */
export const Columns = Symbol.for('drizzle:Columns');
/** @internal */
export const ExtraConfigColumns = Symbol.for('drizzle:ExtraConfigColumns');
/** @internal */
export const OriginalName = Symbol.for('drizzle:OriginalName');
/** @internal */
export const BaseName = Symbol.for('drizzle:BaseName');
/** @internal */
export const IsAlias = Symbol.for('drizzle:IsAlias');
/** @internal */
export const ExtraConfigBuilder = Symbol.for('drizzle:ExtraConfigBuilder');
const IsDrizzleTable = Symbol.for('drizzle:IsDrizzleTable');
export class Table {
    static [entityKind] = 'Table';
    /** @internal */
    static Symbol = {
        Name: TableName,
        Schema: Schema,
        OriginalName: OriginalName,
        Columns: Columns,
        ExtraConfigColumns: ExtraConfigColumns,
        BaseName: BaseName,
        IsAlias: IsAlias,
        ExtraConfigBuilder: ExtraConfigBuilder,
    };
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    [TableName];
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    [OriginalName];
    /** @internal */
    [Schema];
    /** @internal */
    [Columns];
    /** @internal */
    [ExtraConfigColumns];
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    [BaseName];
    /** @internal */
    [IsAlias] = false;
    /** @internal */
    [IsDrizzleTable] = true;
    /** @internal */
    [ExtraConfigBuilder] = undefined;
    constructor(name, schema, baseName) {
        this[TableName] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
    }
}
export function isTable(table) {
    return typeof table === 'object' && table !== null && IsDrizzleTable in table;
}
export function getTableName(table) {
    return table[TableName];
}
export function getTableUniqueName(table) {
    return `${table[Schema] ?? 'public'}.${table[TableName]}`;
}
//# sourceMappingURL=table.js.map