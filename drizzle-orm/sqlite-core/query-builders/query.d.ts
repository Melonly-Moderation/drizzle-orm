import { QueryPromise } from '~/query-promise.ts';
import { type BuildQueryResult, type DBQueryConfig, type TableRelationalConfig, type TablesRelationalConfig } from '~/relations.ts';
import type { RunnableQuery } from '~/runnable-query.ts';
import type { Query, SQLWrapper } from '~/sql/sql.ts';
import type { KnownKeysOnly } from '~/utils.ts';
import type { SQLiteDialect } from '../dialect.ts';
import type { PreparedQueryConfig, SQLitePreparedQuery, SQLiteSession } from '../session.ts';
import type { SQLiteTable } from '../table.ts';
export type SQLiteRelationalQueryKind<TMode extends 'sync' | 'async', TResult> = TMode extends 'async' ? SQLiteRelationalQuery<TMode, TResult> : SQLiteSyncRelationalQuery<TResult>;
export declare class RelationalQueryBuilder<TMode extends 'sync' | 'async', TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
    static readonly [x: number]: string;
    protected mode: TMode;
    protected fullSchema: Record<string, unknown>;
    protected schema: TSchema;
    protected tableNamesMap: Record<string, string>;
    protected table: SQLiteTable;
    protected tableConfig: TableRelationalConfig;
    protected dialect: SQLiteDialect;
    protected session: SQLiteSession<'async', unknown, TFullSchema, TSchema>;
    constructor(mode: TMode, fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: SQLiteTable, tableConfig: TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<'async', unknown, TFullSchema, TSchema>);
    findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): SQLiteRelationalQueryKind<TMode, BuildQueryResult<TSchema, TFields, TConfig>[]>;
    findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): SQLiteRelationalQueryKind<TMode, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
export declare class SQLiteRelationalQuery<TType extends 'sync' | 'async', TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
    static readonly [x: number]: string;
    private fullSchema;
    private schema;
    private tableNamesMap;
    private tableConfig;
    private dialect;
    private session;
    private config;
    readonly _: {
        readonly dialect: 'sqlite';
        readonly type: TType;
        readonly result: TResult;
    };
    constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, 
    /** @internal */
    table: SQLiteTable, tableConfig: TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<'sync' | 'async', unknown, Record<string, unknown>, TablesRelationalConfig>, config: DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
    prepare(): SQLitePreparedQuery<PreparedQueryConfig & {
        type: TType;
        all: TResult;
        get: TResult;
        execute: TResult;
    }>;
    private _toSQL;
    toSQL(): Query;
    execute(): Promise<TResult>;
}
export declare class SQLiteSyncRelationalQuery<TResult> extends SQLiteRelationalQuery<'sync', TResult> {
    static readonly [x: number]: string;
    sync(): TResult;
}
