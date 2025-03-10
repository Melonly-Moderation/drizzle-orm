import type { PrismaClient } from '@prisma/client/extension';
import { type Logger } from '~/logger.ts';
import type { PgDialect, PgQueryResultHKT, PgTransaction, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/index.ts';
import type { Query, SQL } from '~/sql/sql.ts';
export declare class PrismaPgPreparedQuery<T> extends PgPreparedQuery<PreparedQueryConfig & {
    execute: T;
}> {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaClient, query: Query, logger: Logger);
    execute(placeholderValues?: Record<string, unknown>): Promise<T>;
    all(): Promise<unknown>;
    isResponseInArrayMode(): boolean;
}
export interface PrismaPgSessionOptions {
    logger?: Logger;
}
export declare class PrismaPgSession extends PgSession {
    static readonly [x: number]: string;
    private readonly prisma;
    private readonly options;
    private readonly logger;
    constructor(dialect: PgDialect, prisma: PrismaClient, options: PrismaPgSessionOptions);
    execute<T>(query: SQL): Promise<T>;
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query): PgPreparedQuery<T>;
    transaction<T>(_transaction: (tx: PgTransaction<PgQueryResultHKT, Record<string, never>, Record<string, never>>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export interface PrismaPgQueryResultHKT extends PgQueryResultHKT {
    type: [];
}
