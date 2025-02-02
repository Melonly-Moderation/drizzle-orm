import { entityKind } from '~/entity.ts';
import { Table } from '~/table.ts';
import { getSQLiteColumnBuilders } from './columns/all.ts';
/** @internal */
export const InlineForeignKeys = Symbol.for('drizzle:SQLiteInlineForeignKeys');
export class SQLiteTable extends Table {
    static [entityKind] = 'SQLiteTable';
    /** @internal */
    static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys,
    });
    /** @internal */
    [Table.Symbol.Columns];
    /** @internal */
    [InlineForeignKeys] = [];
    /** @internal */
    [Table.Symbol.ExtraConfigBuilder] = undefined;
}
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new SQLiteTable(name, schema, baseName);
    const parsedColumns = typeof columns === 'function' ? columns(getSQLiteColumnBuilders()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
        const colBuilder = colBuilderBase;
        colBuilder.setName(name);
        const column = colBuilder.build(rawTable);
        rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
        return [name, column];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[Table.Symbol.Columns] = builtColumns;
    table[Table.Symbol.ExtraConfigColumns] = builtColumns;
    if (extraConfig) {
        table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
}
export const sqliteTable = (name, columns, extraConfig) => {
    return sqliteTableBase(name, columns, extraConfig);
};
export function sqliteTableCreator(customizeTableName) {
    return (name, columns, extraConfig) => {
        return sqliteTableBase(customizeTableName(name), columns, extraConfig, undefined, name);
    };
}
//# sourceMappingURL=table.js.map