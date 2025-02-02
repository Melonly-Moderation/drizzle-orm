import type { SQL } from '~/sql/sql.ts';
import type { SQLiteColumn } from './columns/index.ts';
import type { SQLiteTable } from './table.ts';
export interface IndexConfig {
    name: string;
    columns: IndexColumn[];
    unique: boolean;
    where: SQL | undefined;
}
export type IndexColumn = SQLiteColumn | SQL;
export declare class IndexBuilderOn {
    static readonly [x: number]: string;
    private name;
    private unique;
    constructor(name: string, unique: boolean);
    on(...columns: [IndexColumn, ...IndexColumn[]]): IndexBuilder;
}
export declare class IndexBuilder {
    static readonly [x: number]: string;
    _: {
        brand: 'SQLiteIndexBuilder';
    };
    constructor(name: string, columns: IndexColumn[], unique: boolean);
    /**
     * Condition for partial index.
     */
    where(condition: SQL): this;
}
export declare class Index {
    static readonly [x: number]: string;
    _: {
        brand: 'SQLiteIndex';
    };
    readonly config: IndexConfig & {
        table: SQLiteTable;
    };
    constructor(config: IndexConfig, table: SQLiteTable);
}
export declare function index(name: string): IndexBuilderOn;
export declare function uniqueIndex(name: string): IndexBuilderOn;
