import type { AnySingleStoreColumn, SingleStoreColumn } from './columns/index.ts';
import { SingleStoreTable } from './table.ts';
export declare function primaryKey<TTableName extends string, TColumn extends AnySingleStoreColumn<{
    tableName: TTableName;
}>, TColumns extends AnySingleStoreColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnySingleStoreColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [x: number]: string;
    constructor(columns: SingleStoreColumn[], name?: string);
}
export declare class PrimaryKey {
    static readonly [x: number]: string;
    readonly table: SingleStoreTable;
    readonly columns: SingleStoreColumn[];
    readonly name?: string;
    constructor(table: SingleStoreTable, columns: SingleStoreColumn[], name?: string);
    getName(): string;
}
