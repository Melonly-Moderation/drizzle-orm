import { type MySqlTableFn } from './table.ts';
import { type mysqlView } from './view.ts';
export declare class MySqlSchema<TName extends string = string> {
    static readonly [x: number]: string;
    readonly schemaName: TName;
    constructor(schemaName: TName);
    table: MySqlTableFn<TName>;
    view: typeof mysqlView;
}
/** @deprecated - use `instanceof MySqlSchema` */
export declare function isMySqlSchema(obj: unknown): obj is MySqlSchema;
/**
 * Create a MySQL schema.
 * https://dev.mysql.com/doc/refman/8.0/en/create-database.html
 *
 * @param name mysql use schema name
 * @returns MySQL schema
 */
export declare function mysqlDatabase<TName extends string>(name: TName): MySqlSchema<TName>;
/**
 * @see mysqlDatabase
 */
export declare const mysqlSchema: typeof mysqlDatabase;
