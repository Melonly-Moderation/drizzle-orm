import type { Database, RunResult, Statement } from 'better-sqlite3';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
import type { SQLiteSyncDialect } from '~/sqlite-core/dialect.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import type { SelectedFieldsOrdered } from '~/sqlite-core/query-builders/select.types.ts';
import { type PreparedQueryConfig as PreparedQueryConfigBase, type SQLiteExecuteMethod, SQLitePreparedQuery as PreparedQueryBase, SQLiteSession, type SQLiteTransactionConfig } from '~/sqlite-core/session.ts';
export interface BetterSQLiteSessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class BetterSQLiteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'sync', RunResult, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private logger;
    constructor(client: Database, dialect: SQLiteSyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: BetterSQLiteSessionOptions);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): PreparedQuery<T>;
    transaction<T>(transaction: (tx: BetterSQLiteTransaction<TFullSchema, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
export declare class BetterSQLiteTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'sync', RunResult, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: BetterSQLiteTransaction<TFullSchema, TSchema>) => T): T;
}
export declare class PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends PreparedQueryBase<{
    type: 'sync';
    run: RunResult;
    all: T['all'];
    get: T['get'];
    values: T['values'];
    execute: T['execute'];
}> {
    static readonly [x: number]: string;
    private stmt;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    constructor(stmt: Statement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => unknown) | undefined);
    run(placeholderValues?: Record<string, unknown>): RunResult;
    all(placeholderValues?: Record<string, unknown>): T['all'];
    get(placeholderValues?: Record<string, unknown>): T['get'];
    values(placeholderValues?: Record<string, unknown>): T['values'];
}
export {};
