import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { SQLiteTransaction } from '~/sqlite-core/index.ts';
import { SQLiteSession, } from '~/sqlite-core/session.ts';
import { SQLitePreparedQuery as PreparedQueryBase } from '~/sqlite-core/session.ts';
import { mapResultRow } from '~/utils.ts';
export class SQLiteDOSession extends SQLiteSession {
    client;
    schema;
    static [entityKind] = 'SQLiteDOSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
        return new SQLiteDOPreparedQuery(this.client, query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
    }
    transaction(transaction, _config) {
        const tx = new SQLiteDOTransaction('sync', this.dialect, this, this.schema);
        this.client.transactionSync(() => {
            transaction(tx);
        });
        return {};
    }
}
export class SQLiteDOTransaction extends SQLiteTransaction {
    static [entityKind] = 'SQLiteDOTransaction';
    transaction(transaction) {
        const tx = new SQLiteDOTransaction('sync', this.dialect, this.session, this.schema, this.nestedIndex + 1);
        this.session.transaction(() => transaction(tx));
        return {};
    }
}
export class SQLiteDOPreparedQuery extends PreparedQueryBase {
    client;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'SQLiteDOPreparedQuery';
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
        params.length > 0 ? this.client.sql.exec(this.query.sql, ...params) : this.client.sql.exec(this.query.sql);
    }
    all(placeholderValues) {
        const { fields, joinsNotNullableMap, query, logger, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            const params = fillPlaceholders(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return params.length > 0 ? client.sql.exec(query.sql, ...params).toArray() : client.sql.exec(query.sql).toArray();
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
        const { fields, client, joinsNotNullableMap, customResultMapper, query } = this;
        if (!fields && !customResultMapper) {
            return params.length > 0 ? client.sql.exec(query.sql, ...params).one() : client.sql.exec(query.sql).one();
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
        const res = params.length > 0
            ? this.client.sql.exec(this.query.sql, ...params)
            : this.client.sql.exec(this.query.sql);
        // @ts-ignore .raw().toArray() exists
        return res.raw().toArray();
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map