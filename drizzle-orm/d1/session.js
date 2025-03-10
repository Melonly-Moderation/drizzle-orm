/// <reference types="@cloudflare/workers-types" />
import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class SQLiteD1Session extends SQLiteSession {
    client;
    schema;
    options;
    static [entityKind] = 'SQLiteD1Session';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        const stmt = this.client.prepare(query.sql);
        return new D1PreparedQuery(stmt, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
            const preparedQuery = query._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            if (builtQuery.params.length > 0) {
                builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
            }
            else {
                const builtQuery = preparedQuery.getQuery();
                builtQueries.push(this.client.prepare(builtQuery.sql).bind(...builtQuery.params));
            }
        }
        const batchResults = await this.client.batch(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
    }
    extractRawAllValueFromBatchResult(result) {
        return result.results;
    }
    extractRawGetValueFromBatchResult(result) {
        return result.results[0];
    }
    extractRawValuesValueFromBatchResult(result) {
        return d1ToRawMapping(result.results);
    }
    async transaction(transaction, config) {
        const tx = new D1Transaction('async', this.dialect, this, this.schema);
        await this.run(sql.raw(`begin${config?.behavior ? ' ' + config.behavior : ''}`));
        try {
            const result = await transaction(tx);
            await this.run(sql `commit`);
            return result;
        }
        catch (err) {
            await this.run(sql `rollback`);
            throw err;
        }
    }
}
export class D1Transaction extends SQLiteTransaction {
    static [entityKind] = 'D1Transaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new D1Transaction('async', this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await this.session.run(sql.raw(`savepoint ${savepointName}`));
        try {
            const result = await transaction(tx);
            await this.session.run(sql.raw(`release savepoint ${savepointName}`));
            return result;
        }
        catch (err) {
            await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
/**
 * This function was taken from the D1 implementation: https://github.com/cloudflare/workerd/blob/4aae9f4c7ae30a59a88ca868c4aff88bda85c956/src/cloudflare/internal/d1-api.ts#L287
 * It may cause issues with duplicated column names in join queries, which should be fixed on the D1 side.
 * @param results
 * @returns
 */
function d1ToRawMapping(results) {
    const rows = [];
    for (const row of results) {
        const entry = Object.keys(row).map((k) => row[k]);
        rows.push(entry);
    }
    return rows;
}
export class D1PreparedQuery extends SQLitePreparedQuery {
    logger;
    _isResponseInArrayMode;
    static [entityKind] = 'D1PreparedQuery';
    /** @internal */
    customResultMapper;
    /** @internal */
    fields;
    /** @internal */
    stmt;
    constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
        super('async', executeMethod, query);
        this.logger = logger;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.fields = fields;
        this.stmt = stmt;
    }
    run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.stmt.bind(...params).run();
    }
    async all(placeholderValues) {
        const { fields, query, logger, stmt, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
        }
        const rows = await this.values(placeholderValues);
        return this.mapAllResult(rows);
    }
    mapAllResult(rows, isFromBatch) {
        if (isFromBatch) {
            rows = d1ToRawMapping(rows.results);
        }
        if (!this.fields && !this.customResultMapper) {
            return rows;
        }
        if (this.customResultMapper) {
            return this.customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
    }
    async get(placeholderValues) {
        const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.bind(...params).all().then(({ results }) => results[0]);
        }
        const rows = await this.values(placeholderValues);
        if (!rows[0]) {
            return undefined;
        }
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return mapResultRow(fields, rows[0], joinsNotNullableMap);
    }
    mapGetResult(result, isFromBatch) {
        if (isFromBatch) {
            result = d1ToRawMapping(result.results)[0];
        }
        if (!this.fields && !this.customResultMapper) {
            return result;
        }
        if (this.customResultMapper) {
            return this.customResultMapper([result]);
        }
        return mapResultRow(this.fields, result, this.joinsNotNullableMap);
    }
    values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.stmt.bind(...params).raw();
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map