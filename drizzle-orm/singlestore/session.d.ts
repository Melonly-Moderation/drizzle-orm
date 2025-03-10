import type { Connection, FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { Logger } from '~/logger.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { SingleStoreDialect } from '~/singlestore-core/dialect.ts';
import type { SelectedFieldsOrdered } from '~/singlestore-core/query-builders/select.types.ts';
import { type PreparedQueryKind, SingleStorePreparedQuery, type SingleStorePreparedQueryConfig, type SingleStorePreparedQueryHKT, type SingleStoreQueryResultHKT, SingleStoreSession, SingleStoreTransaction, type SingleStoreTransactionConfig } from '~/singlestore-core/session.ts';
import type { Query, SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export type SingleStoreDriverClient = Pool | Connection;
export type SingleStoreRawQueryResult = [ResultSetHeader, FieldPacket[]];
export type SingleStoreQueryResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;
export type SingleStoreQueryResult<T = any> = [T extends ResultSetHeader ? T : T[], FieldPacket[]];
export declare class SingleStoreDriverPreparedQuery<T extends SingleStorePreparedQueryConfig> extends SingleStorePreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private params;
    private logger;
    private fields;
    private customResultMapper?;
    private generatedIds?;
    private returningIds?;
    private rawQuery;
    private query;
    constructor(client: SingleStoreDriverClient, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered);
    execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
    iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
export interface SingleStoreDriverSessionOptions {
    logger?: Logger;
}
export declare class SingleStoreDriverSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreSession<SingleStoreQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: SingleStoreDriverClient, dialect: SingleStoreDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: SingleStoreDriverSessionOptions);
    prepareQuery<T extends SingleStorePreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<SingleStoreDriverPreparedQueryHKT, T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TSchema>) => Promise<T>, config?: SingleStoreTransactionConfig): Promise<T>;
}
export declare class SingleStoreDriverTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends SingleStoreTransaction<SingleStoreDriverQueryResultHKT, SingleStoreDriverPreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: SingleStoreDriverTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface SingleStoreDriverQueryResultHKT extends SingleStoreQueryResultHKT {
    type: SingleStoreRawQueryResult;
}
export interface SingleStoreDriverPreparedQueryHKT extends SingleStorePreparedQueryHKT {
    type: SingleStoreDriverPreparedQuery<Assume<this['config'], SingleStorePreparedQueryConfig>>;
}
