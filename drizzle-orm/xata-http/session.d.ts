import type { SQLPluginResult, SQLQueryResult } from '@xata.io/client';
import type { Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
export type XataHttpClient = {
    sql: SQLPluginResult;
};
export interface QueryResults<ArrayMode extends 'json' | 'array'> {
    rowCount: number;
    rows: ArrayMode extends 'array' ? any[][] : Record<string, any>[];
    rowAsArray: ArrayMode extends 'array' ? true : false;
}
export declare class XataHttpPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    constructor(client: XataHttpClient, query: Query, logger: Logger, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
    values(placeholderValues?: Record<string, unknown> | undefined): Promise<T['values']>;
}
export interface XataHttpSessionOptions {
    logger?: Logger;
}
export declare class XataHttpSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<XataHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: XataHttpClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: XataHttpSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<QueryResults<'array'>>;
    queryObjects(query: string, params: unknown[]): Promise<QueryResults<'json'>>;
    transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class XataTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<XataHttpQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(_transaction: (tx: XataTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface XataHttpQueryResultHKT extends PgQueryResultHKT {
    type: SQLQueryResult<this['row']>;
}
