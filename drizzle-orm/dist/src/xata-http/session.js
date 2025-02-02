import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
export class XataHttpPreparedQuery extends PgPreparedQuery {
    client;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'XataHttpPreparedQuery';
    constructor(client, query, logger, fields, _isResponseInArrayMode, customResultMapper) {
        super(query);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    async execute(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        const { fields, client, query, customResultMapper, joinsNotNullableMap } = this;
        if (!fields && !customResultMapper) {
            return await client.sql({ statement: query.sql, params });
            // return { rowCount: result.records.length, rows: result.records, rowAsArray: false };
        }
        const { rows, warning } = await client.sql({ statement: query.sql, params, responseType: 'array' });
        if (warning)
            console.warn(warning);
        return customResultMapper
            ? customResultMapper(rows)
            : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    all(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client.sql({ statement: this.query.sql, params, responseType: 'array' }).then((result) => result.rows);
    }
    values(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client.sql({ statement: this.query.sql, params }).then((result) => result.records);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class XataHttpSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'XataHttpSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new XataHttpPreparedQuery(this.client, query, this.logger, fields, isResponseInArrayMode, customResultMapper);
    }
    async query(query, params) {
        this.logger.logQuery(query, params);
        const result = await this.client.sql({ statement: query, params, responseType: 'array' });
        return {
            rowCount: result.rows.length,
            rows: result.rows,
            rowAsArray: true,
        };
    }
    async queryObjects(query, params) {
        const result = await this.client.sql({ statement: query, params });
        return {
            rowCount: result.records.length,
            rows: result.records,
            rowAsArray: false,
        };
    }
    async transaction(_transaction, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _config = {}) {
        throw new Error('No transactions support in Xata Http driver');
    }
}
export class XataTransaction extends PgTransaction {
    static [entityKind] = 'XataHttpTransaction';
    async transaction(_transaction) {
        throw new Error('No transactions support in Xata Http driver');
    }
}
//# sourceMappingURL=session.js.map