import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
import { mapRelationalRow, } from '~/relations.ts';
export class RelationalQueryBuilder {
    mode;
    fullSchema;
    schema;
    tableNamesMap;
    table;
    tableConfig;
    dialect;
    session;
    static [entityKind] = 'SQLiteAsyncRelationalQueryBuilder';
    constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
        this.mode = mode;
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
    }
    findMany(config) {
        return (this.mode === 'sync'
            ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, 'many')
            : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, 'many'));
    }
    findFirst(config) {
        return (this.mode === 'sync'
            ? new SQLiteSyncRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? { ...config, limit: 1 } : { limit: 1 }, 'first')
            : new SQLiteRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? { ...config, limit: 1 } : { limit: 1 }, 'first'));
    }
}
export class SQLiteRelationalQuery extends QueryPromise {
    fullSchema;
    schema;
    tableNamesMap;
    table;
    tableConfig;
    dialect;
    session;
    config;
    static [entityKind] = 'SQLiteAsyncRelationalQuery';
    /** @internal */
    mode;
    constructor(fullSchema, schema, tableNamesMap, 
    /** @internal */
    table, tableConfig, dialect, session, config, mode) {
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
        this.config = config;
        this.mode = mode;
    }
    /** @internal */
    getSQL() {
        return this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName,
        }).sql;
    }
    /** @internal */
    _prepare(isOneTimeQuery = false) {
        const { query, builtQuery } = this._toSQL();
        return this.session[isOneTimeQuery ? 'prepareOneTimeQuery' : 'prepareQuery'](builtQuery, undefined, this.mode === 'first' ? 'get' : 'all', true, (rawRows, mapColumnValue) => {
            const rows = rawRows.map((row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
            if (this.mode === 'first') {
                return rows[0];
            }
            return rows;
        });
    }
    prepare() {
        return this._prepare(false);
    }
    _toSQL() {
        const query = this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName,
        });
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return { query, builtQuery };
    }
    toSQL() {
        return this._toSQL().builtQuery;
    }
    /** @internal */
    executeRaw() {
        if (this.mode === 'first') {
            return this._prepare(false).get();
        }
        return this._prepare(false).all();
    }
    async execute() {
        return this.executeRaw();
    }
}
export class SQLiteSyncRelationalQuery extends SQLiteRelationalQuery {
    static [entityKind] = 'SQLiteSyncRelationalQuery';
    sync() {
        return this.executeRaw();
    }
}
//# sourceMappingURL=query.js.map