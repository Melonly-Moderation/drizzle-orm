import type { Connection, FieldPacket, OkPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { Logger } from '~/logger.ts';
import type { MySqlDialect } from '~/mysql-core/dialect.ts';
import type { SelectedFieldsOrdered } from '~/mysql-core/query-builders/select.types.ts';
import { type Mode, MySqlPreparedQuery, type MySqlPreparedQueryConfig, type MySqlPreparedQueryHKT, type MySqlQueryResultHKT, MySqlSession, MySqlTransaction, type MySqlTransactionConfig, type PreparedQueryKind } from '~/mysql-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { Query, SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export type MySql2Client = Pool | Connection;
export type MySqlRawQueryResult = [ResultSetHeader, FieldPacket[]];
export type MySqlQueryResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader;
export type MySqlQueryResult<T = any> = [T extends ResultSetHeader ? T : T[], FieldPacket[]];
export declare class MySql2PreparedQuery<T extends MySqlPreparedQueryConfig> extends MySqlPreparedQuery<T> {
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
    constructor(client: MySql2Client, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined, generatedIds?: Record<string, unknown>[] | undefined, returningIds?: SelectedFieldsOrdered);
    execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
    iterator(placeholderValues?: Record<string, unknown>): AsyncGenerator<T['execute'] extends any[] ? T['execute'][number] : T['execute']>;
}
export interface MySql2SessionOptions {
    logger?: Logger;
    mode: Mode;
}
export declare class MySql2Session<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlSession<MySqlQueryResultHKT, MySql2PreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    private mode;
    constructor(client: MySql2Client, dialect: MySqlDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: MySql2SessionOptions);
    prepareQuery<T extends MySqlPreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, customResultMapper?: (rows: unknown[][]) => T['execute'], generatedIds?: Record<string, unknown>[], returningIds?: SelectedFieldsOrdered): PreparedQueryKind<MySql2PreparedQueryHKT, T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    transaction<T>(transaction: (tx: MySql2Transaction<TFullSchema, TSchema>) => Promise<T>, config?: MySqlTransactionConfig): Promise<T>;
}
export declare class MySql2Transaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends MySqlTransaction<MySql2QueryResultHKT, MySql2PreparedQueryHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: MySql2Transaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface MySql2QueryResultHKT extends MySqlQueryResultHKT {
    type: MySqlRawQueryResult;
}
export interface MySql2PreparedQueryHKT extends MySqlPreparedQueryHKT {
    type: MySql2PreparedQuery<Assume<this['config'], MySqlPreparedQueryConfig>>;
}
