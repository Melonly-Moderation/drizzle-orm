import type { TablesRelationalConfig } from '~/relations.ts';
import type { PreparedQuery } from '~/session.ts';
import { type Query, type SQL } from '~/sql/index.ts';
import type { NeonAuthToken } from '~/utils.ts';
import { PgDatabase } from './db.ts';
import type { PgDialect } from './dialect.ts';
import type { SelectedFieldsOrdered } from './query-builders/select.types.ts';
export interface PreparedQueryConfig {
    execute: unknown;
    all: unknown;
    values: unknown;
}
export declare abstract class PgPreparedQuery<T extends PreparedQueryConfig> implements PreparedQuery {
    static readonly [x: number]: string;
    protected query: Query;
    constructor(query: Query);
    protected authToken?: NeonAuthToken;
    getQuery(): Query;
    mapResult(response: unknown, _isFromBatch?: boolean): unknown;
    abstract execute(placeholderValues?: Record<string, unknown>): Promise<T['execute']>;
}
export interface PgTransactionConfig {
    isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
    accessMode?: 'read only' | 'read write';
    deferrable?: boolean;
}
export declare abstract class PgSession<TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
    static readonly [x: number]: string;
    protected dialect: PgDialect;
    constructor(dialect: PgDialect);
    abstract prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(query: Query, fields: SelectedFieldsOrdered | undefined, name: string | undefined, isResponseInArrayMode: boolean, customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T['execute']): PgPreparedQuery<T>;
    execute<T>(query: SQL): Promise<T>;
    all<T = unknown>(query: SQL): Promise<T[]>;
    count(sql: SQL): Promise<number>;
    abstract transaction<T>(transaction: (tx: PgTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T>;
}
export declare abstract class PgTransaction<TQueryResult extends PgQueryResultHKT, TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> extends PgDatabase<TQueryResult, TFullSchema, TSchema> {
    static readonly [x: number]: string;
    protected schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined;
    protected readonly nestedIndex: number;
    constructor(dialect: PgDialect, session: PgSession<any, any, any>, schema: {
        fullSchema: Record<string, unknown>;
        schema: TSchema;
        tableNamesMap: Record<string, string>;
    } | undefined, nestedIndex?: number);
    rollback(): never;
    setTransaction(config: PgTransactionConfig): Promise<void>;
    abstract transaction<T>(transaction: (tx: PgTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
export interface PgQueryResultHKT {
    readonly $brand: 'PgQueryResultHKT';
    readonly row: unknown;
    readonly type: unknown;
}
export type PgQueryResultKind<TKind extends PgQueryResultHKT, TRow> = (TKind & {
    readonly row: TRow;
})['type'];
