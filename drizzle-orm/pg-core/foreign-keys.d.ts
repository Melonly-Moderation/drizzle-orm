import type { AnyPgColumn, PgColumn } from './columns/index.ts';
import type { PgTable } from './table.ts';
export type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';
export type Reference = () => {
    readonly name?: string;
    readonly columns: PgColumn[];
    readonly foreignTable: PgTable;
    readonly foreignColumns: PgColumn[];
};
export declare class ForeignKeyBuilder {
    static readonly [x: number]: string;
    constructor(config: () => {
        name?: string;
        columns: PgColumn[];
        foreignColumns: PgColumn[];
    }, actions?: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    } | undefined);
    onUpdate(action: UpdateDeleteAction): this;
    onDelete(action: UpdateDeleteAction): this;
}
export type AnyForeignKeyBuilder = ForeignKeyBuilder;
export declare class ForeignKey {
    static readonly [x: number]: string;
    readonly table: PgTable;
    readonly reference: Reference;
    readonly onUpdate: UpdateDeleteAction | undefined;
    readonly onDelete: UpdateDeleteAction | undefined;
    constructor(table: PgTable, builder: ForeignKeyBuilder);
    getName(): string;
}
type ColumnsWithTable<TTableName extends string, TColumns extends PgColumn[]> = {
    [Key in keyof TColumns]: AnyPgColumn<{
        tableName: TTableName;
    }>;
};
export declare function foreignKey<TTableName extends string, TForeignTableName extends string, TColumns extends [AnyPgColumn<{
    tableName: TTableName;
}>, ...AnyPgColumn<{
    tableName: TTableName;
}>[]]>(config: {
    name?: string;
    columns: TColumns;
    foreignColumns: ColumnsWithTable<TForeignTableName, TColumns>;
}): ForeignKeyBuilder;
export {};
