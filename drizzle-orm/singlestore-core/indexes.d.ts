import type { SQL } from '~/sql/sql.ts';
import type { AnySingleStoreColumn, SingleStoreColumn } from './columns/index.ts';
import type { SingleStoreTable } from './table.ts';
interface IndexConfig {
    name: string;
    columns: IndexColumn[];
    /**
     * If true, the index will be created as `create unique index` instead of `create index`.
     */
    unique?: boolean;
    /**
     * If set, the index will be created as `create index ... using { 'btree' | 'hash' }`.
     */
    using?: 'btree' | 'hash';
    /**
     * If set, the index will be created as `create index ... algorythm { 'default' | 'inplace' | 'copy' }`.
     */
    algorythm?: 'default' | 'inplace' | 'copy';
    /**
     * If set, adds locks to the index creation.
     */
    lock?: 'default' | 'none' | 'shared' | 'exclusive';
}
export type IndexColumn = SingleStoreColumn | SQL;
export declare class IndexBuilderOn {
    static readonly [x: number]: string;
    private name;
    private unique;
    constructor(name: string, unique: boolean);
    on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
export interface AnyIndexBuilder {
    build(table: SingleStoreTable): Index;
}
export interface IndexBuilder extends AnyIndexBuilder {
}
export declare class IndexBuilder implements AnyIndexBuilder {
    static readonly [x: number]: string;
    constructor(name: string, columns: IndexColumn[], unique: boolean);
    using(using: IndexConfig['using']): this;
    algorythm(algorythm: IndexConfig['algorythm']): this;
    lock(lock: IndexConfig['lock']): this;
}
export declare class Index {
    static readonly [x: number]: string;
    readonly config: IndexConfig & {
        table: SingleStoreTable;
    };
    constructor(config: IndexConfig, table: SingleStoreTable);
}
export type GetColumnsTableName<TColumns> = TColumns extends AnySingleStoreColumn<{
    tableName: infer TTableName extends string;
}> | AnySingleStoreColumn<{
    tableName: infer TTableName extends string;
}>[] ? TTableName : never;
export declare function index(name: string): IndexBuilderOn;
export declare function uniqueIndex(name: string): IndexBuilderOn;
export {};
/** @internal */
/** @internal */
/** @internal */
