import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class LibSQLSession extends SQLiteSession {
    client;
    schema;
    options;
    tx;
    static [entityKind] = 'LibSQLSession';
    logger;
    constructor(client, dialect, schema, options, tx) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.tx = tx;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        return new LibSQLPreparedQuery(this.client, query, this.logger, fields, this.tx, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
            const preparedQuery = query._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.batch(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
    }
    async migrate(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
            const preparedQuery = query._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.migrate(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
    }
    async transaction(transaction, _config) {
        // TODO: support transaction behavior
        const libsqlTx = await this.client.transaction();
        const session = new LibSQLSession(this.client, this.dialect, this.schema, this.options, libsqlTx);
        const tx = new LibSQLTransaction('async', this.dialect, session, this.schema);
        try {
            const result = await transaction(tx);
            await libsqlTx.commit();
            return result;
        }
        catch (err) {
            await libsqlTx.rollback();
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
export class LibSQLTransaction extends SQLiteTransaction {
    static [entityKind] = 'LibSQLTransaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new LibSQLTransaction('async', this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
export class LibSQLPreparedQuery extends SQLitePreparedQuery {
    client;
    logger;
    fields;
    tx;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'LibSQLPreparedQuery';
    constructor(client, query, logger, 
    /** @internal */ fields, tx, executeMethod, _isResponseInArrayMode, 
    /** @internal */ customResultMapper) {
        super('async', executeMethod, query);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this.tx = tx;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.customResultMapper = customResultMapper;
        this.fields = fields;
    }
    run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const stmt = { sql: this.query.sql, args: params };
        return this.tx ? this.tx.execute(stmt) : this.client.execute(stmt);
    }
    async all(placeholderValues) {
        const { fields, logger, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows }) => this.mapAllResult(rows));
        }
        const rows = await this.values(placeholderValues);
        return this.mapAllResult(rows);
    }
    mapAllResult(rows, isFromBatch) {
        if (isFromBatch) {
            rows = rows.rows;
        }
        if (!this.fields && !this.customResultMapper) {
            return rows.map((row) => normalizeRow(row));
        }
        if (this.customResultMapper) {
            return this.customResultMapper(rows, normalizeFieldValue);
        }
        return rows.map((row) => {
            return mapResultRow(this.fields, Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)), this.joinsNotNullableMap);
        });
    }
    async get(placeholderValues) {
        const { fields, logger, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows }) => this.mapGetResult(rows));
        }
        const rows = await this.values(placeholderValues);
        return this.mapGetResult(rows);
    }
    mapGetResult(rows, isFromBatch) {
        if (isFromBatch) {
            rows = rows.rows;
        }
        const row = rows[0];
        if (!this.fields && !this.customResultMapper) {
            return normalizeRow(row);
        }
        if (!row) {
            return undefined;
        }
        if (this.customResultMapper) {
            return this.customResultMapper(rows, normalizeFieldValue);
        }
        return mapResultRow(this.fields, Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)), this.joinsNotNullableMap);
    }
    values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const stmt = { sql: this.query.sql, args: params };
        return (this.tx ? this.tx.execute(stmt) : this.client.execute(stmt)).then(({ rows }) => rows);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
function normalizeRow(obj) {
    // The libSQL node-sqlite3 compatibility wrapper returns rows
    // that can be accessed both as objects and arrays. Let's
    // turn them into objects what's what other SQLite drivers
    // do.
    return Object.keys(obj).reduce((acc, key) => {
        if (Object.prototype.propertyIsEnumerable.call(obj, key)) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}
function normalizeFieldValue(value) {
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) { // eslint-disable-line no-instanceof/no-instanceof
        if (typeof Buffer !== 'undefined') {
            if (!(value instanceof Buffer)) { // eslint-disable-line no-instanceof/no-instanceof
                return Buffer.from(value);
            }
            return value;
        }
        if (typeof TextDecoder !== 'undefined') {
            return new TextDecoder().decode(value);
        }
        throw new Error('TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.');
    }
    return value;
}
//# sourceMappingURL=session.js.map