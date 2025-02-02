import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery, SQLiteSession, } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class ExpoSQLiteSession extends SQLiteSession {
    client;
    schema;
    static [entityKind] = 'ExpoSQLiteSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        const stmt = this.client.prepareSync(query.sql);
        return new ExpoSQLitePreparedQuery(stmt, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    transaction(transaction, config = {}) {
        const tx = new ExpoSQLiteTransaction('sync', this.dialect, this, this.schema);
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
export class ExpoSQLiteTransaction extends SQLiteTransaction {
    static [entityKind] = 'ExpoSQLiteTransaction';
    transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new ExpoSQLiteTransaction('sync', this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
export class ExpoSQLitePreparedQuery extends SQLitePreparedQuery {
    stmt;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'ExpoSQLitePreparedQuery';
    constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
        super('sync', executeMethod, query);
        this.stmt = stmt;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const { changes, lastInsertRowId } = this.stmt.executeSync(params);
        return {
            changes,
            lastInsertRowId,
        };
    }
    all(placeholderValues) {
        const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.executeSync(params).getAllSync();
        }
        const rows = this.values(placeholderValues);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    get(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return stmt.executeSync(params).getFirstSync();
        }
        const rows = this.values(placeholderValues);
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
        return this.stmt.executeForRawResultSync(params).getAllSync();
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map