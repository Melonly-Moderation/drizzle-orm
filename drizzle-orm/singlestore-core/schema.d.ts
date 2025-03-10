import { type SingleStoreTableFn } from './table.ts';
export declare class SingleStoreSchema<TName extends string = string> {
    static readonly [x: number]: string;
    readonly schemaName: TName;
    constructor(schemaName: TName);
    table: SingleStoreTableFn<TName>;
}
/** @deprecated - use `instanceof SingleStoreSchema` */
export declare function isSingleStoreSchema(obj: unknown): obj is SingleStoreSchema;
/**
 * Create a SingleStore schema.
 * https://docs.singlestore.com/cloud/create-a-database/
 *
 * @param name singlestore use schema name
 * @returns SingleStore schema
 */
export declare function singlestoreDatabase<TName extends string>(name: TName): SingleStoreSchema<TName>;
/**
 * @see singlestoreDatabase
 */
export declare const singlestoreSchema: typeof singlestoreDatabase;
