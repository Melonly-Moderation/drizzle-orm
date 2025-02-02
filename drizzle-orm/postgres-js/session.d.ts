import type { Row, RowList, Sql, TransactionSql } from 'postgres';
import type { Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export declare class PostgresJsPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    constructor(client: Sql, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface PostgresJsSessionOptions {
    logger?: Logger;
}
export declare class PostgresJsSession<TSQL extends Sql, TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<PostgresJsQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    client: TSQL;
    private schema;
    logger: Logger;
    constructor(client: TSQL, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, 
    /** @internal */
    options?: PostgresJsSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    query(query: string, params: unknown[]): Promise<RowList<Row[]>>;
    queryObjects<T extends Row>(query: string, params: unknown[]): Promise<RowList<T[]>>;
    transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare class PostgresJsTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<PostgresJsQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    constructor(dialect: PgDialect, 
    /** @internal */
    session: PostgresJsSession<TransactionSql, TFullSchema, TSchema>, schema: RelationalSchemaConfig<TSchema> | undefined, nestedIndex?: number);
    transaction<T>(transaction: (tx: PostgresJsTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PostgresJsQueryResultHKT extends PgQueryResultHKT {
    type: RowList<Assume<this['row'], Row>[]>;
}
