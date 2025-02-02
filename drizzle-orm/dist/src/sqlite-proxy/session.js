import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class SQLiteRemoteSession extends SQLiteSession {
    client;
    schema;
    batchCLient;
    static [entityKind] = 'SQLiteRemoteSession';
    logger;
    constructor(client, dialect, schema, batchCLient, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.batchCLient = batchCLient;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        return new RemotePreparedQuery(this.client, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
            const preparedQuery = query._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            builtQueries.push({ sql: builtQuery.sql, params: builtQuery.params, method: builtQuery.method });
        }
        const batchResults = await this.batchCLient(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
    }
    async transaction(transaction, config) {
        const tx = new SQLiteProxyTransaction('async', this.dialect, this, this.schema);
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
    extractRawAllValueFromBatchResult(result) {
        return result.rows;
    }
    extractRawGetValueFromBatchResult(result) {
        return result.rows[0];
    }
    extractRawValuesValueFromBatchResult(result) {
        return result.rows;
    }
}
export class SQLiteProxyTransaction extends SQLiteTransaction {
    static [entityKind] = 'SQLiteProxyTransaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new SQLiteProxyTransaction('async', this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
export class RemotePreparedQuery extends SQLitePreparedQuery {
    client;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'SQLiteProxyPreparedQuery';
    method;
    constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, 
    /** @internal */ customResultMapper) {
        super('async', executeMethod, query);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.customResultMapper = customResultMapper;
        this.method = executeMethod;
    }
    getQuery() {
        return { ...this.query, method: this.method };
    }
    run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.client(this.query.sql, params, 'run');
    }
    mapAllResult(rows, isFromBatch) {
        if (isFromBatch) {
            rows = rows.rows;
        }
        if (!this.fields && !this.customResultMapper) {
            return rows;
        }
        if (this.customResultMapper) {
            return this.customResultMapper(rows);
        }
        return rows.map((row) => {
            return mapResultRow(this.fields, row, this.joinsNotNullableMap);
        });
    }
    async all(placeholderValues) {
        const { query, logger, client } = this;
        const params = fillPlaceholders(query.params, placeholderValues ?? {});
        logger.logQuery(query.sql, params);
        const { rows } = await client(query.sql, params, 'all');
        return this.mapAllResult(rows);
    }
    async get(placeholderValues) {
        const { query, logger, client } = this;
        const params = fillPlaceholders(query.params, placeholderValues ?? {});
        logger.logQuery(query.sql, params);
        const clientResult = await client(query.sql, params, 'get');
        return this.mapGetResult(clientResult.rows);
    }
    mapGetResult(rows, isFromBatch) {
        if (isFromBatch) {
            rows = rows.rows;
        }
        const row = rows;
        if (!this.fields && !this.customResultMapper) {
            return row;
        }
        if (!row) {
            return undefined;
        }
        if (this.customResultMapper) {
            return this.customResultMapper([rows]);
        }
        return mapResultRow(this.fields, row, this.joinsNotNullableMap);
    }
    async values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const clientResult = await this.client(this.query.sql, params, 'values');
        return clientResult.rows;
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map