import type { AnyPgColumn, PgColumn } from './columns/index.ts';
import { PgTable } from './table.ts';
export declare function primaryKey<TTableName extends string, TColumn extends AnyPgColumn<{
    tableName: TTableName;
}>, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]>(config: {
    name?: string;
    columns: [TColumn, ...TColumns];
}): PrimaryKeyBuilder;
/**
 * @deprecated: Please use primaryKey({ columns: [] }) instead of this function
 * @param columns
 */
export declare function primaryKey<TTableName extends string, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]>(...columns: TColumns): PrimaryKeyBuilder;
export declare class PrimaryKeyBuilder {
    static readonly [x: number]: string;
    constructor(columns: PgColumn[], name?: string);
}
export declare class PrimaryKey {
    static readonly [x: number]: string;
    readonly table: PgTable;
    readonly columns: AnyPgColumn<{}>[];
    readonly name?: string;
    constructor(table: PgTable, columns: AnyPgColumn<{}>[], name?: string);
    getName(): string;
}
