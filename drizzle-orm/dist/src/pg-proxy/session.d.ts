import { entityKind } from '~/entity.ts';
import type { Logger } from '~/logger.ts';
import type { PgDialect } from '~/pg-core/dialect.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { PgQueryResultHKT, PgTransactionConfig, PreparedQueryConfig } from '~/pg-core/session.ts';
import { PgPreparedQuery as PreparedQueryBase, PgSession } from '~/pg-core/session.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { QueryWithTypings } from '~/sql/sql.ts';
import { type Assume } from '~/utils.ts';
import type { RemoteCallback } from './driver.ts';
export interface PgRemoteSessionOptions {
    logger?: Logger;
}
export declare class PgRemoteSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<PgRemoteQueryResultHKT, TFullSchema, TSchema> {
    private client;
    private schema;
    static readonly [entityKind]: string;
    private logger;
    constructor(client: RemoteCallback, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options?: PgRemoteSessionOptions);
    prepareQuery<T extends PreparedQueryConfig>(query: QueryWithTypings, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][]) => T['execute']): PreparedQuery<T>;
    transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TSchema>) => Promise<T>, _config?: PgTransactionConfig): Promise<T>;
}
export declare class PgProxyTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<PgRemoteQueryResultHKT, TFullSchema, TSchema> {
    static readonly [entityKind]: string;
    transaction<T>(_transaction: (tx: PgProxyTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export declare class PreparedQuery<T extends PreparedQueryConfig> extends PreparedQueryBase<T> {
    private client;
    private queryString;
    private params;
    private typings;
    private logger;
    private fields;
    private _isResponseInArrayMode;
    private customResultMapper?;
    static readonly [entityKind]: string;
    constructor(client: RemoteCallback, queryString: string, params: unknown[], typings: any[] | undefined, logger: Logger, fields: SelectedFieldsOrdered | undefined, _isResponseInArrayMode: boolean, customResultMapper?: ((rows: unknown[][]) => T["execute"]) | undefined);
    execute(placeholderValues?: Record<string, unknown> | undefined): Promise<T['execute']>;
    all(): Promise<void>;
}
export interface PgRemoteQueryResultHKT extends PgQueryResultHKT {
    type: Assume<this['row'], {
        [column: string]: any;
    }>[];
}
