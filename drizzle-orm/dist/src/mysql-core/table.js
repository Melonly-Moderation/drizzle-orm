import { entityKind } from '~/entity.ts';
import { Table } from '~/table.ts';
import { getMySqlColumnBuilders } from './columns/all.ts';
/** @internal */
export const InlineForeignKeys = Symbol.for('drizzle:MySqlInlineForeignKeys');
export class MySqlTable extends Table {
    static [entityKind] = 'MySqlTable';
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
export function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new MySqlTable(name, schema, baseName);
    const parsedColumns = typeof columns === 'function' ? columns(getMySqlColumnBuilders()) : columns;
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
        table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
}
export const mysqlTable = (name, columns, extraConfig) => {
    return mysqlTableWithSchema(name, columns, extraConfig, undefined, name);
};
export function mysqlTableCreator(customizeTableName) {
    return (name, columns, extraConfig) => {
        return mysqlTableWithSchema(customizeTableName(name), columns, extraConfig, undefined, name);
    };
}
//# sourceMappingURL=table.js.map