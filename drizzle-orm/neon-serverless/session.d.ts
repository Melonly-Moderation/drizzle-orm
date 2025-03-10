import { type Client, Pool, type PoolClient, type QueryResult, type QueryResultRow } from '@neondatabase/serverless';
import type { Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query, type SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export type NeonClient = Pool | PoolClient | Client;
export declare class NeonPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    private rawQueryConfig;
    private queryConfig;
    constructor(client: NeonClient, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface NeonSessionOptions {
    logger?: Logger;
}
export declare class NeonSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<NeonQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: NeonClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: NeonSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<QueryResult>;
    queryObjects<T extends QueryResultRow>(query: string, params: unknown[]): Promise<QueryResult<T>>;
    count(sql: SQL): Promise<number>;
    transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<NeonQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface NeonQueryResultHKT extends PgQueryResultHKT {
    type: QueryResult<Assume<this['row'], QueryResultRow>>;
}
