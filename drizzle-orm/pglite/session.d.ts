import type { PGlite, Results, Row, Transaction } from '@electric-sql/pglite';
import { type Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { type Query, type SQL } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
export type PgliteClient = PGlite;
export declare class PglitePreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
    static readonly [x: number]: string;
    private client;
    private queryString;
    private params;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    private rawQueryConfig;
    private queryConfig;
    constructor(client: PgliteClient | Transaction, queryString: string, params: unknown[], logger: Logger, fields: SelectedFieldsOrdered | undefined, name: string | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']>;
}
export interface PgliteSessionOptions {
    logger?: Logger;
}
export declare class PgliteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<PgliteQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    private client;
    private schema;
    private options;
    private logger;
    constructor(client: PgliteClient | Transaction, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: PgliteSessionOptions);
    prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PgPreparedQuery<T>;
    transaction<T>(transaction: (tx: PgliteTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T>;
    count(sql: SQL): Promise<number>;
}
export declare class PgliteTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<PgliteQueryResultHKT, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    transaction<T>(transaction: (tx: PgliteTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PgliteQueryResultHKT extends PgQueryResultHKT {
    type: Results<Assume<this['row'], Row>>;
}
