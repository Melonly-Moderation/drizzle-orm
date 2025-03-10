import type { Connection, FullResult, Tx } from '@tidbcloud/serverless';
import type { Logger } from '~/logger.ts';
import type { MySqlDialect } from '~/mysql-core/dialect.ts';
import type { SelectedFieldsOrdered } from '~/mysql-core/query-builders/select.types.ts';
import { MySqlPreparedQuery, type MySqlPreparedQueryConfig, type MySqlPreparedQueryHKT, type MySqlQueryResultHKT, MySqlSession, MySqlTransaction } from '~/mysql-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query, type SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export declare class TiDBServerlessPreparedQuery<T extends MySqlPreparedQueryConfig> extends MySqlPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private customResultMapper?;
    private generatedIds?;
    private returningIds?;
    constructor(client: Tx | Connection, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
export interface TiDBServerlessSessionOptions {
    logger?: Logger;
}
export declare class TiDBServerlessSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlSession<TiDBServerlessQueryResultHKT, TiDBServerlessPreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private baseClient;
    private schema;
    private options;
    private logger;
    private client;
    constructor(baseClient: Connection, dialect: MySqlDialect, tx: Tx | undefined, schema: RelationalSchemaConfig<TSchema> | undefined, options?: TiDBServerlessSessionOptions);
    prepareQuery<T extends MySqlPreparedQueryConfig = MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): MySqlPreparedQuery<T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    transaction<T>(transaction: (tx: TiDBServerlessTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class TiDBServerlessTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlTransaction<TiDBServerlessQueryResultHKT, TiDBServerlessPreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    constructor(dialect: MySqlDialect, session: MySqlSession, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
    transaction<T>(transaction: (tx: TiDBServerlessTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface TiDBServerlessQueryResultHKT extends MySqlQueryResultHKT {
    type: FullResult;
}
export interface TiDBServerlessPreparedQueryHKT extends MySqlPreparedQueryHKT {
    type: TiDBServerlessPreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
