import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession, } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class OPSQLiteSession extends SQLiteSession {
    client;
    schema;
    static [entityKind] = 'OPSQLiteSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        return new OPSQLitePreparedQuery(this.client, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    transaction(transaction, config = {}) {
        const tx = new OPSQLiteTransaction('async', this.dialect, this, this.schema);
        this.run(sql.raw(`begin${config?.behavior ? ' ' + config.behavior : ''}`));
        try {
            const result = transaction(tx);
            this.run(sql `commit`);
            return result;
        }
        catch (err) {
            this.run(sql `rollback`);
            throw err;
        }
    }
}
export class OPSQLiteTransaction extends SQLiteTransaction {
    static [entityKind] = 'OPSQLiteTransaction';
    transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new OPSQLiteTransaction('async', this.dialect, this.session, this.schema, this.nestedIndex + 1);
        this.session.run(sql.raw(`savepoint ${savepointName}`));
        try {
            const result = transaction(tx);
            this.session.run(sql.raw(`release savepoint ${savepointName}`));
            return result;
        }
        catch (err) {
            this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
export class OPSQLitePreparedQuery extends SQLitePreparedQuery {
    client;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'OPSQLitePreparedQuery';
    constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
        super('sync', executeMethod, query);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.client.executeAsync(this.query.sql, params);
    }
    async all(placeholderValues) {
        const { fields, joinsNotNullableMap, query, logger, customResultMapper, client } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return client.execute(query.sql, params).rows?._array || [];
        }
        const rows = await this.values(placeholderValues);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    async get(placeholderValues) {
        const { fields, joinsNotNullableMap, customResultMapper, query, logger, client } = this;
        const params = fillPlaceholders(query.params, placeholderValues ?? {});
        logger.logQuery(query.sql, params);
        if (!fields && !customResultMapper) {
            const rows = client.execute(query.sql, params).rows?._array || [];
            return rows[0];
        }
        const rows = await this.values(placeholderValues);
        const row = rows[0];
        if (!row) {
            return undefined;
        }
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return mapResultRow(fields, row, joinsNotNullableMap);
    }
    values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.client.executeRawAsync(this.query.sql, params);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map