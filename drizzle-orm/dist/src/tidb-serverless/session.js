import { Column } from '~/column.ts';
import { entityKind, is } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { MySqlPreparedQuery, MySqlSession, MySqlTransaction, } from '~/mysql-core/session.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
const executeRawConfig = { fullResult: true };
const queryConfig = { arrayMode: true };
export class TiDBServerlessPreparedQuery extends MySqlPreparedQuery {
    client;
    queryString;
    params;
    logger;
    fields;
    customResultMapper;
    generatedIds;
    returningIds;
    static [entityKind] = 'TiDBPreparedQuery';
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
        this.logger.logQuery(this.queryString, params);
        const { fields, client, queryString, joinsNotNullableMap, customResultMapper, returningIds, generatedIds } = this;
        if (!fields && !customResultMapper) {
            const res = await client.execute(queryString, params, executeRawConfig);
            const insertId = res.lastInsertId ?? 0;
            const affectedRows = res.rowsAffected ?? 0;
            // for each row, I need to check keys from
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
            return res;
        }
        const rows = await client.execute(queryString, params, queryConfig);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    iterator(_placeholderValues) {
        throw new Error('Streaming is not supported by the TiDB Cloud Serverless driver');
    }
}
export class TiDBServerlessSession extends MySqlSession {
    baseClient;
    schema;
    options;
    static [entityKind] = 'TiDBServerlessSession';
    logger;
    client;
    constructor(baseClient, dialect, tx, schema, options = {}) {
        super(dialect);
        this.baseClient = baseClient;
        this.schema = schema;
        this.options = options;
        this.client = tx ?? baseClient;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, customResultMapper, generatedIds, returningIds) {
        return new TiDBServerlessPreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper, generatedIds, returningIds);
    }
    all(query) {
        const querySql = this.dialect.sqlToQuery(query);
        this.logger.logQuery(querySql.sql, querySql.params);
        return this.client.execute(querySql.sql, querySql.params);
    }
    async count(sql) {
        const res = await this.execute(sql);
        return Number(res['rows'][0]['count']);
    }
    async transaction(transaction) {
        const nativeTx = await this.baseClient.begin();
        try {
            const session = new TiDBServerlessSession(this.baseClient, this.dialect, nativeTx, this.schema, this.options);
            const tx = new TiDBServerlessTransaction(this.dialect, session, this.schema);
            const result = await transaction(tx);
            await nativeTx.commit();
            return result;
        }
        catch (err) {
            await nativeTx.rollback();
            throw err;
        }
    }
}
export class TiDBServerlessTransaction extends MySqlTransaction {
    static [entityKind] = 'TiDBServerlessTransaction';
    constructor(dialect, session, schema, nestedIndex = 0) {
        super(dialect, session, schema, nestedIndex, 'default');
    }
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new TiDBServerlessTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await tx.execute(sql.raw(`savepoint ${savepointName}`));
        try {
            const result = await transaction(tx);
            await tx.execute(sql.raw(`release savepoint ${savepointName}`));
            return result;
        }
        catch (err) {
            await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
//# sourceMappingURL=session.js.map