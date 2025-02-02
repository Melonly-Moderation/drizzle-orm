import { type QueryResult, type QueryResultRow, type VercelClient, VercelPool, type VercelPoolClient } from '@vercel/postgres';
import { entityKind } from '~/entity.ts';
import { type Logger } from '~/logger.ts';
import { type PgDialect, PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query, type SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export type VercelPgClient = VercelPool | VercelClient | VercelPoolClient;
export declare class VercelPgPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    private client;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    private rawQuery;
    private queryConfig;
    constructor(client: VercelPgClient, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface VercelPgSessionOptions {
    logger?: Logger;
}
export declare class VercelPgSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<VercelPgQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    private options;
    static readonly [entityKind]: string;
    private logger;
    constructor(client: VercelPgClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: VercelPgSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<QueryResult>;
    queryObjects<T extends QueryResultRow>(query: string, params: unknown[]): Promise<QueryResult<T>>;
    count(sql: SQL): Promise<number>;
    transaction<T>(transaction: (tx: VercelPgTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
}
export declare class VercelPgTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<VercelPgQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(transaction: (tx: VercelPgTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface VercelPgQueryResultHKT extends PgQueryResultHKT {
    type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
