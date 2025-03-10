import type { PrismaClient } from '@prisma/client/extension';
import { type Logger } from '~/logger.ts';
import type { MySqlDialect, MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlTransaction, MySqlTransactionConfig } from '~/mysql-core/index.ts';
import { MySqlPreparedQuery, MySqlSession } from '~/mysql-core/index.ts';
import type { Query, SQL } from '~/sql/sql.ts';
import type { Assume } from '~/utils.ts';
export declare class PrismaMySqlPreparedQuery<T> extends MySqlPreparedQuery<MySqlPreparedQueryConfig & {
    execute: T;
}> {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly query;
    private readonly logger;
    iterator(_placeholderValues?: Record<string, unknown> | undefined): AsyncGenerator<unknown, any, unknown>;
    constructor(prisma: PrismaClient, query: Query, logger: Logger);
    execute(placeholderValues?: Record<string, unknown>): Promise<T>;
}
export interface PrismaMySqlSessionOptions {
    logger?: Logger;
}
export declare class PrismaMySqlSession extends MySqlSession {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly options;
    private readonly logger;
    constructor(dialect: MySqlDialect, prisma: PrismaClient, options: PrismaMySqlSessionOptions);
    execute<T>(query: SQL): Promise<T>;
    all<T = unknown>(_query: SQL): Promise<T[]>;
    prepareQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query): MySqlPreparedQuery<T>;
    transaction<T>(_transaction: (tx: MySqlTransaction<PrismaMySqlQueryResultHKT, PrismaMySqlPreparedQueryHKT, Record<string, never>, Record<string, never>>) => Promise<T>, _config?: MySqlTransactionConfig): Promise<T>;
}
export interface PrismaMySqlQueryResultHKT extends MySqlQueryResultHKT {
    type: [];
}
export interface PrismaMySqlPreparedQueryHKT extends MySqlPreparedQueryHKT {
    type: PrismaMySqlPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
