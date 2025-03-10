import type { MigrationConfig, MigrationMeta } from '~/migrator.ts';
import { PgColumn } from '~/pg-core/columns/index.ts';
import type { PgDeleteConfig, PgInsertConfig, PgUpdateConfig } from '~/pg-core/query-builders/index.ts';
import type { PgSelectConfig } from '~/pg-core/query-builders/select.types.ts';
import { PgTable } from '~/pg-core/table.ts';
import { type BuildRelationalQueryResult, type DBQueryConfig, type Relation, type TableRelationalConfig, type TablesRelationalConfig } from '~/relations.ts';
import { type DriverValueEncoder, type QueryTypingsValue, type QueryWithTypings, SQL } from '~/sql/sql.ts';
import { type Casing, type UpdateSet } from '~/utils.ts';
import type { PgSession } from './session.ts';
import type { PgMaterializedView } from './view.ts';
export interface PgDialectConfig {
    casing?: Casing;
}
export declare class PgDialect {
    static readonly [x: number]: string;
    constructor(config?: PgDialectConfig);
    migrate(migrations: MigrationMeta[], session: PgSession, config: string | MigrationConfig): Promise<void>;
    escapeName(name: string): string;
    escapeParam(num: number): string;
    escapeString(str: string): string;
    private buildWithCTE;
    buildDeleteQuery({ table, where, returning, withList }: PgDeleteConfig): SQL;
    buildUpdateSet(table: PgTable, set: UpdateSet): SQL;
    buildUpdateQuery({ table, set, where, returning, withList, from, joins }: PgUpdateConfig): SQL;
    /**
     * Builds selection SQL with provided fields/expressions
     *
     * Examples:
     *
     * `select <selection> from`
     *
     * `insert ... returning <selection>`
     *
     * If `isSingleTable` is true, then columns won't be prefixed with table name
     */
    private buildSelection;
    private buildJoins;
    private buildFromTable;
    buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, }: PgSelectConfig): SQL;
    buildSetOperations(leftSelect: SQL, setOperators: PgSelectConfig['setOperators']): SQL;
    buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset }, }: {
        leftSelect: SQL;
        setOperator: PgSelectConfig['setOperators'][number];
    }): SQL;
    buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_ }: PgInsertConfig): SQL;
    buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }: {
        view: PgMaterializedView;
        concurrently?: boolean;
        withNoData?: boolean;
    }): SQL;
    prepareTyping(encoder: DriverValueEncoder<unknown, unknown>): QueryTypingsValue;
    sqlToQuery(sql: SQL, invokeSource?: 'indexes' | undefined): QueryWithTypings;
    buildRelationalQueryWithoutPK({ fullSchema, schema, tableNamesMap, table, tableConfig, queryConfig: config, tableAlias, nestedQueryRelation, joinOn, }: {
        fullSchema: Record<string, unknown>;
        schema: TablesRelationalConfig;
        tableNamesMap: Record<string, string>;
        table: PgTable;
        tableConfig: TableRelationalConfig;
        queryConfig: true | DBQueryConfig<'many', true>;
        tableAlias: string;
        nestedQueryRelation?: Relation;
        joinOn?: SQL;
    }): BuildRelationalQueryResult<PgTable, PgColumn>;
}
