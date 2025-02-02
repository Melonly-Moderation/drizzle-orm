import { entityKind } from '~/entity.ts';
import { Table } from '~/table.ts';
import { getPgColumnBuilders } from './columns/all.ts';
/** @internal */
export const InlineForeignKeys = Symbol.for('drizzle:PgInlineForeignKeys');
/** @internal */
export const EnableRLS = Symbol.for('drizzle:EnableRLS');
export class PgTable extends Table {
    static [entityKind] = 'PgTable';
    /** @internal */
    static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys,
        EnableRLS: EnableRLS,
    });
    /**@internal */
    [InlineForeignKeys] = [];
    /** @internal */
    [EnableRLS] = false;
    /** @internal */
    [Table.Symbol.ExtraConfigBuilder] = undefined;
}
/** @internal */
export function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new PgTable(name, schema, baseName);
    const parsedColumns = typeof columns === 'function' ? columns(getPgColumnBuilders()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
        const colBuilder = colBuilderBase;
        colBuilder.setName(name);
        const column = colBuilder.build(rawTable);
        rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
        return [name, column];
    }));
    const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
        const colBuilder = colBuilderBase;
        colBuilder.setName(name);
        const column = colBuilder.buildExtraConfigColumn(rawTable);
        return [name, column];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[Table.Symbol.Columns] = builtColumns;
    table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
    if (extraConfig) {
        table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return Object.assign(table, {
        enableRLS: () => {
            table[PgTable.Symbol.EnableRLS] = true;
            return table;
        },
    });
}
export const pgTable = (name, columns, extraConfig) => {
    return pgTableWithSchema(name, columns, extraConfig, undefined);
};
export function pgTableCreator(customizeTableName) {
    return (name, columns, extraConfig) => {
        return pgTableWithSchema(customizeTableName(name), columns, extraConfig, undefined, name);
    };
}
//# sourceMappingURL=table.js.map