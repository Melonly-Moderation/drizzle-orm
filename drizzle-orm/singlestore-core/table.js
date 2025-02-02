import { entityKind } from '~/entity.ts';
import { Table } from '~/table.ts';
import { getSingleStoreColumnBuilders } from './columns/all.ts';
export class SingleStoreTable extends Table {
    static [entityKind] = 'SingleStoreTable';
    /** @internal */
    static Symbol = Object.assign({}, Table.Symbol, {});
    /** @internal */
    [Table.Symbol.Columns];
    /** @internal */
    [Table.Symbol.ExtraConfigBuilder] = undefined;
}
export function singlestoreTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new SingleStoreTable(name, schema, baseName);
    const parsedColumns = typeof columns === 'function' ? columns(getSingleStoreColumnBuilders()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
        const colBuilder = colBuilderBase;
        colBuilder.setName(name);
        const column = colBuilder.build(rawTable);
        return [name, column];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[Table.Symbol.Columns] = builtColumns;
    table[Table.Symbol.ExtraConfigColumns] = builtColumns;
    if (extraConfig) {
        table[SingleStoreTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
}
export const singlestoreTable = (name, columns, extraConfig) => {
    return singlestoreTableWithSchema(name, columns, extraConfig, undefined, name);
};
export function singlestoreTableCreator(customizeTableName) {
    return (name, columns, extraConfig) => {
        return singlestoreTableWithSchema(customizeTableName(name), columns, extraConfig, undefined, name);
    };
}
//# sourceMappingURL=table.js.map