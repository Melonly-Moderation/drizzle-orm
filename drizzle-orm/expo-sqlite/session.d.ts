import type { SQLiteDatabase, SQLiteRunResult, SQLiteStatement } from 'expo-sqlite';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
import type { SQLiteSyncDialect } from '~/sqlite-core/dialect.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import type { SelectedFieldsOrdered } from '~/sqlite-core/query-builders/select.types.ts';
import { type PreparedQueryConfig as PreparedQueryConfigBase, type SQLiteExecuteMethod, SQLitePreparedQuery, SQLiteSession, type SQLiteTransactionConfig } from '~/sqlite-core/session.ts';
export interface ExpoSQLiteSessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class ExpoSQLiteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'sync', SQLiteRunResult, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private logger;
    constructor(client: SQLiteDatabase, dialect: SQLiteSyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: ExpoSQLiteSessionOptions);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): ExpoSQLitePreparedQuery<T>;
    transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
export declare class ExpoSQLiteTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'sync', SQLiteRunResult, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: ExpoSQLiteTransaction<TFullSchema, TSchema>) => T): T;
}
export declare class ExpoSQLitePreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'sync';
    run: SQLiteRunResult;
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
    constructor(stmt: SQLiteStatement, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => unknown) | undefined);
    run(placeholderValues?: Record<string, unknown>): SQLiteRunResult;
    all(placeholderValues?: Record<string, unknown>): T['all'];
    get(placeholderValues?: Record<string, unknown>): T['get'];
    values(placeholderValues?: Record<string, unknown>): T['values'];
}
export {};
