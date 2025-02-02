import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { tracer } from '~/tracing.ts';
import { mapResultRow } from '~/utils.ts';
export class PostgresJsPreparedQuery extends PgPreparedQuery {
    client;
    queryString;
    params;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'PostgresJsPreparedQuery';
    constructor(client, queryString, params, logger, fields, _isResponseInArrayMode, customResultMapper) {
        super({ sql: queryString, params });
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    async execute(placeholderValues = {}) {
        return tracer.startActiveSpan('drizzle.execute', async (span) => {
            const params = fillPlaceholders(this.params, placeholderValues);
            span?.setAttributes({
                'drizzle.query.text': this.queryString,
                'drizzle.query.params': JSON.stringify(params),
            });
            this.logger.logQuery(this.queryString, params);
            const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
            if (!fields && !customResultMapper) {
                return tracer.startActiveSpan('drizzle.driver.execute', () => {
                    return client.unsafe(query, params);
                });
            }
            const rows = await tracer.startActiveSpan('drizzle.driver.execute', () => {
                span?.setAttributes({
                    'drizzle.query.text': query,
                    'drizzle.query.params': JSON.stringify(params),
                });
                return client.unsafe(query, params).values();
            });
            return tracer.startActiveSpan('drizzle.mapResponse', () => {
                return customResultMapper
                    ? customResultMapper(rows)
                    : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
            });
        });
    }
    all(placeholderValues = {}) {
        return tracer.startActiveSpan('drizzle.execute', async (span) => {
            const params = fillPlaceholders(this.params, placeholderValues);
            span?.setAttributes({
                'drizzle.query.text': this.queryString,
                'drizzle.query.params': JSON.stringify(params),
            });
            this.logger.logQuery(this.queryString, params);
            return tracer.startActiveSpan('drizzle.driver.execute', () => {
                span?.setAttributes({
                    'drizzle.query.text': this.queryString,
                    'drizzle.query.params': JSON.stringify(params),
                });
                return this.client.unsafe(this.queryString, params);
            });
        });
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class PostgresJsSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'PostgresJsSession';
    logger;
    constructor(client, dialect, schema, 
    /** @internal */
    options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new PostgresJsPreparedQuery(this.client, query.sql, query.params, this.logger, fields, isResponseInArrayMode, customResultMapper);
    }
    query(query, params) {
        this.logger.logQuery(query, params);
        return this.client.unsafe(query, params).values();
    }
    queryObjects(query, params) {
        return this.client.unsafe(query, params);
    }
    transaction(transaction, config) {
        return this.client.begin(async (client) => {
            const session = new PostgresJsSession(client, this.dialect, this.schema, this.options);
            const tx = new PostgresJsTransaction(this.dialect, session, this.schema);
            if (config) {
                await tx.setTransaction(config);
            }
            return transaction(tx);
        });
    }
}
export class PostgresJsTransaction extends PgTransaction {
    session;
    static [entityKind] = 'PostgresJsTransaction';
    constructor(dialect, 
    /** @internal */
    session, schema, nestedIndex = 0) {
        super(dialect, session, schema, nestedIndex);
        this.session = session;
    }
    transaction(transaction) {
        return this.session.client.savepoint((client) => {
            const session = new PostgresJsSession(client, this.dialect, this.schema, this.session.options);
            const tx = new PostgresJsTransaction(this.dialect, session, this.schema);
            return transaction(tx);
        });
    }
}
//# sourceMappingURL=session.js.map