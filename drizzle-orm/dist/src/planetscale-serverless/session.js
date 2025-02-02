import { Column } from '~/column.ts';
import { entityKind, is } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { MySqlPreparedQuery, MySqlSession, MySqlTransaction, } from '~/mysql-core/session.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
export class PlanetScalePreparedQuery extends MySqlPreparedQuery {
    client;
    queryString;
    params;
    logger;
    fields;
    customResultMapper;
    generatedIds;
    returningIds;
    static [entityKind] = 'PlanetScalePreparedQuery';
    rawQuery = { as: 'object' };
    query = { as: 'array' };
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
        const { fields, client, queryString, rawQuery, query, joinsNotNullableMap, customResultMapper, returningIds, generatedIds, } = this;
        if (!fields && !customResultMapper) {
            const res = await client.execute(queryString, params, rawQuery);
            const insertId = Number.parseFloat(res.insertId);
            const affectedRows = res.rowsAffected;
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
        const { rows } = await client.execute(queryString, params, query);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    iterator(_placeholderValues) {
        throw new Error('Streaming is not supported by the PlanetScale Serverless driver');
    }
}
export class PlanetscaleSession extends MySqlSession {
    baseClient;
    schema;
    options;
    static [entityKind] = 'PlanetscaleSession';
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
        return new PlanetScalePreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper, generatedIds, returningIds);
    }
    async query(query, params) {
        this.logger.logQuery(query, params);
        return await this.client.execute(query, params, { as: 'array' });
    }
    async queryObjects(query, params) {
        return this.client.execute(query, params, { as: 'object' });
    }
    all(query) {
        const querySql = this.dialect.sqlToQuery(query);
        this.logger.logQuery(querySql.sql, querySql.params);
        return this.client.execute(querySql.sql, querySql.params, { as: 'object' }).then((eQuery) => eQuery.rows);
    }
    async count(sql) {
        const res = await this.execute(sql);
        return Number(res['rows'][0]['count']);
    }
    transaction(transaction) {
        return this.baseClient.transaction((pstx) => {
            const session = new PlanetscaleSession(this.baseClient, this.dialect, pstx, this.schema, this.options);
            const tx = new PlanetScaleTransaction(this.dialect, session, this.schema);
            return transaction(tx);
        });
    }
}
export class PlanetScaleTransaction extends MySqlTransaction {
    static [entityKind] = 'PlanetScaleTransaction';
    constructor(dialect, session, schema, nestedIndex = 0) {
        super(dialect, session, schema, nestedIndex, 'planetscale');
    }
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new PlanetScaleTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
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