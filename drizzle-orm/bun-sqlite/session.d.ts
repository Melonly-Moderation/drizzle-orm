import type { Database, Statement as BunStatement } from 'bun:sqlite';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
import type { SQLiteSyncDialect } from '~/sqlite-core/dialect.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import type { SelectedFieldsOrdered } from '~/sqlite-core/query-builders/select.types.ts';
import type { PreparedQueryConfig as PreparedQueryConfigBase, SQLiteExecuteMethod, SQLiteTransactionConfig } from '~/sqlite-core/session.ts';
import { SQLitePreparedQuery as PreparedQueryBase, SQLiteSession } from '~/sqlite-core/session.ts';
export interface SQLiteBunSessionOptions {
    logger?: Logger;
}
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
type Statement = BunStatement<any>;
export declare class SQLiteBunSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteSession<'sync', void, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private logger;
    constructor(client: Database, dialect: SQLiteSyncDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: SQLiteBunSessionOptions);
    exec(query: string): void;
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => unknown): PreparedQuery<T>;
    transaction<T>(transaction: (tx: SQLiteBunTransaction<TFullSchema, TSchema>) => T, config?: SQLiteTransactionConfig): T;
}
export declare class SQLiteBunTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SQLiteTransaction<'sync', void, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: SQLiteBunTransaction<TFullSchema, TSchema>) => T): T;
}
export declare class PreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends PreparedQueryBase<{
    type: 'sync';
    run: void;
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
    run(placeholderValues?: Record<string, unknown>): import("bun:sqlite").Changes;
    all(placeholderValues?: Record<string, unknown>): T['all'];
    get(placeholderValues?: Record<string, unknown>): T['get'];
    values(placeholderValues?: Record<string, unknown>): T['values'];
}
export {};
