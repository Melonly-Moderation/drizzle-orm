import type { FieldPacket, ResultSetHeader } from 'mysql2/promise';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { SingleStoreDialect } from '~/singlestore-core/dialect.ts';
import { SingleStoreTransaction } from '~/singlestore-core/index.ts';
import type { SelectedFieldsOrdered } from '~/singlestore-core/query-builders/select.types.ts';
import type { PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStorePreparedQueryHKT, SingleStoreQueryResultHKT, SingleStoreTransactionConfig } from '~/singlestore-core/session.ts';
import { SingleStorePreparedQuery as PreparedQueryBase, SingleStoreSession } from '~/singlestore-core/session.ts';
import type { Query, SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
import type { RemoteCallback } from './driver.ts';
export type SingleStoreRawQueryResult = [ResultSetHeader, FieldPacket[]];
export interface SingleStoreRemoteSessionOptions {
    logger?: Logger;
}
export declare class SingleStoreRemoteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreSession<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private logger;
    constructor(client: RemoteCallback, dialect: SingleStoreDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: SingleStoreRemoteSessionOptions);
    prepareQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<SingleStoreRemotePreparedQueryHKT, T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    transaction<T>(_transaction: (tx: SingleStoreProxyTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: SingleStoreTransactionConfig): Promise<T>;
}
export declare class SingleStoreProxyTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreTransaction<SingleStoreRemoteQueryResultHKT, SingleStoreRemotePreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(_transaction: (tx: SingleStoreProxyTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class PreparedQuery<T extends SingleStorePreparedQueryConfig> extends PreparedQueryBase<T> {
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
export interface SingleStoreRemoteQueryResultHKT extends SingleStoreQueryResultHKT {
    type: SingleStoreRawQueryResult;
}
export interface SingleStoreRemotePreparedQueryHKT extends SingleStorePreparedQueryHKT {
    type: PreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
