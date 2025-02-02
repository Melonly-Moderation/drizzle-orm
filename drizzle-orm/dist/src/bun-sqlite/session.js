/// <reference types="bun-types" />
import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLitePreparedQuery as PreparedQueryBase, SQLiteSession } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class SQLiteBunSession extends SQLiteSession {
    client;
    schema;
    static [entityKind] = 'SQLiteBunSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    exec(query) {
        this.client.exec(query);
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        const stmt = this.client.prepare(query.sql);
        return new PreparedQuery(stmt, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    transaction(transaction, config = {}) {
        const tx = new SQLiteBunTransaction('sync', this.dialect, this, this.schema);
        let result;
        const nativeTx = this.client.transaction(() => {
            result = transaction(tx);
        });
        nativeTx[config.behavior ?? 'deferred']();
        return result;
    }
}
export class SQLiteBunTransaction extends SQLiteTransaction {
    static [entityKind] = 'SQLiteBunTransaction';
    transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new SQLiteBunTransaction('sync', this.dialect, this.session, this.schema, this.nestedIndex + 1);
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
export class PreparedQuery extends PreparedQueryBase {
    stmt;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'SQLiteBunPreparedQuery';
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
        return this.stmt.run(...params);
    }
    all(placeholderValues) {
        const { fields, query, logger, joinsNotNullableMap, stmt, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.all(...params);
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
        const row = this.stmt.values(...params)[0];
        if (!row) {
            return undefined;
        }
        const { fields, joinsNotNullableMap, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return row;
        }
        if (customResultMapper) {
            return customResultMapper([row]);
        }
        return mapResultRow(fields, row, joinsNotNullableMap);
    }
    values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.stmt.values(...params);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map