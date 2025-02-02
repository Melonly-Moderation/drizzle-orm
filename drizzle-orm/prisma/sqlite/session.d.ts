import type { PrismaClient } from '@prisma/client/extension';
import { type Logger } from '~/logger.ts';
import type { Query } from '~/sql/sql.ts';
import type { PreparedQueryConfig as PreparedQueryConfigBase, SelectedFieldsOrdered, SQLiteAsyncDialect, SQLiteExecuteMethod, SQLiteTransaction, SQLiteTransactionConfig } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/index.ts';
type PreparedQueryConfig = Omit<PreparedQueryConfigBase, 'statement' | 'run'>;
export declare class PrismaSQLitePreparedQuery<T extends PreparedQueryConfig = PreparedQueryConfig> extends SQLitePreparedQuery<{
    type: 'async';
    run: [];
    all: T['all'];
    get: T['get'];
    values: never;
    execute: T['execute'];
}> {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaClient, query: Query, logger: Logger, executeMethod: SQLiteExecuteMethod);
    all(placeholderValues?: Record<string, unknown>): Promise<T['all']>;
    run(placeholderValues?: Record<string, unknown> | undefined): Promise<[]>;
    get(placeholderValues?: Record<string, unknown> | undefined): Promise<T['get']>;
    values(_placeholderValues?: Record<string, unknown> | undefined): Promise<never>;
    isResponseInArrayMode(): boolean;
}
export interface PrismaSQLiteSessionOptions {
    logger?: Logger;
}
export declare class PrismaSQLiteSession extends SQLiteSession<'async', unknown, Record<string, never>, Record<string, never>> {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaClient, dialect: SQLiteAsyncDialect, options: PrismaSQLiteSessionOptions);
    prepareQuery<T extends Omit<PreparedQueryConfig, 'run'>>(query: Query, fields: SelectedFieldsOrdered | undefined, executeMethod: SQLiteExecuteMethod): PrismaSQLitePreparedQuery<T>;
    transaction<T>(_transaction: (tx: SQLiteTransaction<'async', unknown, Record<string, never>, Record<string, never>>) => Promise<T>, _config?: SQLiteTransactionConfig): Promise<T>;
}
export {};
