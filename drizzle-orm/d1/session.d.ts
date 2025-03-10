import type { BatchItem } from '~/batch.ts';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
import type { SQLiteAsyncDialect } from '~/sqlite-core/dialect.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import type { SelectedFieldsOrdered } from '~/sqlite-core/query-builders/select.types.ts';
import type { PreparedQueryConfig as PreparedQueryConfigBase, SQLiteExecuteMethod, SQLiteTransactionConfig } from '~/sqlite-core/session.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/session.ts';
export interface SQLiteD1SessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class SQLiteD1Session<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'async', D1Result, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: D1Database, dialect: SQLiteAsyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteD1SessionOptions);
    prepareQuery(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): D1PreparedQuery;
    batch<T extends BatchItem<'sqlite'>[] | readonly BatchItem<'sqlite'>[]>(queries: T): Promise<any[]>;
    extractRawAllValueFromBatchResult(result: unknown): unknown;
    extractRawGetValueFromBatchResult(result: unknown): unknown;
    extractRawValuesValueFromBatchResult(result: unknown): unknown;
    transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TSchema>) => T | Promise<T>, config?: SQLiteTransactionConfig): Promise<T>;
}
export declare class D1Transaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'async', D1Result, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: D1Transaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class D1PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'async';
    run: D1Response;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    static readonly [x: number]: string;
    private logger;
    private _isResponseInArrayMode;
    constructor(stmt: D1PreparedStatement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown);
    run(placeholderValues?: Record<string, unknown>): Promise<D1Response>;
    all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
    mapAllResult(rows: unknown, isFromBatch?: boolean): unknown;
    get(placeholderValues?: Record<string, unknown>): Promise<T['get']>;
    mapGetResult(result: unknown, isFromBatch?: boolean): unknown;
    values<T extends any[] = unknown[]>(placeholderValues?: Record<string, unknown>): Promise<T[]>;
}
export {};
