import type { FullQueryResults, NeonQueryFunction } from '@neondatabase/serverless';
import type { BatchItem } from '~/batch.ts';
import type { Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery as PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query, type SQL } from '~/sql/sql.ts';
export type NeonHttpClient = NeonQueryFunction<any, any>;
export declare class NeonHttpPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    constructor(client: NeonHttpClient, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues: Record<string, unknown> | undefined): Promise<T['execute']>;
    mapResult(result: unknown): unknown;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface NeonHttpSessionOptions {
    logger?: Logger;
}
export declare class NeonHttpSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<NeonHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: NeonHttpClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: NeonHttpSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    batch<U extends BatchItem<'pg'>, T extends Readonly<[U, ...U[]]>>(queries: T): Promise<any>;
    query(query: string, params: unknown[]): Promise<FullQueryResults<true>>;
    queryObjects(query: string, params: unknown[]): Promise<FullQueryResults<false>>;
    count(sql: SQL): Promise<number>;
    transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class NeonTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<NeonHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(_transaction: (tx: NeonTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export type NeonHttpQueryResult<T> = Omit<FullQueryResults<false>, 'rows'> & {
    rows: T[];
};
export interface NeonHttpQueryResultHKT extends PgQueryResultHKT {
    type: NeonHttpQueryResult<this['row']>;
}
