import type { FieldPacket, ResultSetHeader } from 'mysql2/promise';
import type { Logger } from '~/logger.ts';
import type { MySqlDialect } from '~/mysql-core/dialect.ts';
import { MySqlTransaction } from '~/mysql-core/index.ts';
import type { SelectedFieldsOrdered } from '~/mysql-core/query-builders/select.types.ts';
import type { MySqlPreparedQueryConfig, MySqlPreparedQueryHKT, MySqlQueryResultHKT, MySqlTransactionConfig, PreparedQueryKind } from '~/mysql-core/session.ts';
import { MySqlPreparedQuery as PreparedQueryBase, MySqlSession } from '~/mysql-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { Query, SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
import type { RemoteCallback } from './driver.ts';
export type MySqlRawQueryResult = [ResultSetHeader, FieldPacket[]];
export interface MySqlRemoteSessionOptions {
    logger?: Logger;
}
export declare class MySqlRemoteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlSession<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private logger;
    constructor(client: RemoteCallback, dialect: MySqlDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: MySqlRemoteSessionOptions);
    prepareQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<MySqlRemotePreparedQueryHKT, T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    transaction<T>(_transaction: (tx: MySqlProxyTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: MySqlTransactionConfig): Promise<T>;
}
export declare class MySqlProxyTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlTransaction<MySqlRemoteQueryResultHKT, MySqlRemotePreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(_transaction: (tx: MySqlProxyTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class PreparedQuery<T extends MySqlPreparedQueryConfig> extends PreparedQueryBase<T> {
    static readonly [x: number]: string;
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private customResultMapper?;
    private generatedIds?;
    private returningIds?;
    constructor(client: RemoteCallback, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    iterator(_placeholderValues?: Record<string, unknown>): AsyncGenerator<T['iterator']>;
}
export interface MySqlRemoteQueryResultHKT extends MySqlQueryResultHKT {
    type: MySqlRawQueryResult;
}
export interface MySqlRemotePreparedQueryHKT extends MySqlPreparedQueryHKT {
    type: PreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
