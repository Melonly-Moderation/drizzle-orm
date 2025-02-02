import type { AnyMySqlColumn, MySqlColumn } from './columns/index.ts';
import { MySqlTable } from './table.ts';
export declare function primaryKey<TTableName extends string, TColumn extends AnyMySqlColumn<{
    tableName: TTableName;
}>, TColumns extends AnyMySqlColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnyMySqlColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [x: number]: string;
    constructor(columns: MySqlColumn[], name?: string);
}
export declare class PrimaryKey {
    static readonly [x: number]: string;
    readonly table: MySqlTable;
    readonly columns: MySqlColumn[];
    readonly name?: string;
    constructor(table: MySqlTable, columns: MySqlColumn[], name?: string);
    getName(): string;
}
