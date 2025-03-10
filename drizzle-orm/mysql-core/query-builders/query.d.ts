import { QueryPromise } from '~/query-promise.ts';
import { type BuildQueryResult, type DBQueryConfig, type TableRelationalConfig, type TablesRelationalConfig } from '~/relations.ts';
import type { Query } from '~/sql/sql.ts';
import type { KnownKeysOnly } from '~/utils.ts';
import type { MySqlDialect } from '../dialect.ts';
import type { Mode, MySqlPreparedQueryConfig, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from '../session.ts';
import type { MySqlTable } from '../table.ts';
export declare class RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
    static readonly [x: number]: string;
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    private mode;
    constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: MySqlTable, tableConfig: TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession, mode: Mode);
    findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): MySqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
    findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): MySqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
export declare class MySqlRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
    static readonly [x: number]: string;
    private fullSchema;
    private schema;
    private tableNamesMap;
    private table;
    private tableConfig;
    private dialect;
    private session;
    private config;
    private queryMode;
    private mode?;
    protected $brand: 'MySqlRelationalQuery';
    constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: MySqlTable, tableConfig: TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession, config: DBQueryConfig<'many', true> | true, queryMode: 'many' | 'first', mode?: Mode | undefined);
    prepare(): PreparedQueryKind<TPreparedQueryHKT, MySqlPreparedQueryConfig & {
        execute: TResult;
    }, true>;
    private _getQuery;
    private _toSQL;
    toSQL(): Query;
    execute(): Promise<TResult>;
}
