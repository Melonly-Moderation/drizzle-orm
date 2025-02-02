import { Column } from '~/column.ts';
import { entityKind, is } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { MySqlTransaction } from '~/mysql-core/index.ts';
import { MySqlPreparedQuery as PreparedQueryBase, MySqlSession } from '~/mysql-core/session.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
export class MySqlRemoteSession extends MySqlSession {
    client;
    schema;
    static [entityKind] = 'MySqlRemoteSession';
    logger;
    constructor(client, dialect, schema, options) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, customResultMapper, generatedIds, returningIds) {
        return new PreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper, generatedIds, returningIds);
    }
    all(query) {
        const querySql = this.dialect.sqlToQuery(query);
        this.logger.logQuery(querySql.sql, querySql.params);
        return this.client(querySql.sql, querySql.params, 'all').then(({ rows }) => rows);
    }
    async transaction(_transaction, _config) {
        throw new Error('Transactions are not supported by the MySql Proxy driver');
    }
}
export class MySqlProxyTransaction extends MySqlTransaction {
    static [entityKind] = 'MySqlProxyTransaction';
    async transaction(_transaction) {
        throw new Error('Transactions are not supported by the MySql Proxy driver');
    }
}
export class PreparedQuery extends PreparedQueryBase {
    client;
    queryString;
    params;
    logger;
    fields;
    customResultMapper;
    generatedIds;
    returningIds;
    static [entityKind] = 'MySqlProxyPreparedQuery';
    constructor(client, queryString, params, logger, fields, customResultMapper, 
    // Keys that were used in $default and the value that was generated for them
    generatedIds, 
    // Keys that should be returned, it has the column with all properries + key from object
    returningIds) {
        super();
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this.customResultMapper = customResultMapper;
        this.generatedIds = generatedIds;
        this.returningIds = returningIds;
    }
    async execute(placeholderValues = {}) {
        const params = fillPlaceholders(this.params, placeholderValues);
        const { fields, client, queryString, logger, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
        logger.logQuery(queryString, params);
        if (!fields && !customResultMapper) {
            const { rows: data } = await client(queryString, params, 'execute');
            const insertId = data[0].insertId;
            const affectedRows = data[0].affectedRows;
            if (returningIds) {
                const returningResponse = [];
                let j = 0;
                for (let i = insertId; i < insertId + affectedRows; i++) {
                    for (const column of returningIds) {
                        const key = returningIds[0].path[0];
                        if (is(column.field, Column)) {
                            // @ts-ignore
                            if (column.field.primary && column.field.autoIncrement) {
                                returningResponse.push({ [key]: i });
                            }
                            if (column.field.defaultFn && generatedIds) {
                                // generatedIds[rowIdx][key]
                                returningResponse.push({ [key]: generatedIds[j][key] });
                            }
                        }
                    }
                    j++;
                }
                return returningResponse;
            }
            return data;
        }
        const { rows } = await client(queryString, params, 'all');
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    iterator(_placeholderValues = {}) {
        throw new Error('Streaming is not supported by the MySql Proxy driver');
    }
}
//# sourceMappingURL=session.js.map