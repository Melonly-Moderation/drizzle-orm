import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery as PreparedQueryBase, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { tracer } from '~/tracing.ts';
import { mapResultRow } from '~/utils.ts';
export class PgRemoteSession extends PgSession {
    client;
    schema;
    static [entityKind] = 'PgRemoteSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new PreparedQuery(this.client, query.sql, query.params, query.typings, this.logger, fields, isResponseInArrayMode, customResultMapper);
    }
    async transaction(_transaction, _config) {
        throw new Error('Transactions are not supported by the Postgres Proxy driver');
    }
}
export class PgProxyTransaction extends PgTransaction {
    static [entityKind] = 'PgProxyTransaction';
    async transaction(_transaction) {
        throw new Error('Transactions are not supported by the Postgres Proxy driver');
    }
}
export class PreparedQuery extends PreparedQueryBase {
    client;
    queryString;
    params;
    typings;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'PgProxyPreparedQuery';
    constructor(client, queryString, params, typings, logger, fields, _isResponseInArrayMode, customResultMapper) {
        super({ sql: queryString, params });
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.typings = typings;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    async execute(placeholderValues = {}) {
        return tracer.startActiveSpan('drizzle.execute', async (span) => {
            const params = fillPlaceholders(this.params, placeholderValues);
            const { fields, client, queryString, joinsNotNullableMap, customResultMapper, logger, typings } = this;
            span?.setAttributes({
                'drizzle.query.text': queryString,
                'drizzle.query.params': JSON.stringify(params),
            });
            logger.logQuery(queryString, params);
            if (!fields && !customResultMapper) {
                return tracer.startActiveSpan('drizzle.driver.execute', async () => {
                    const { rows } = await client(queryString, params, 'execute', typings);
                    return rows;
                });
            }
            const rows = await tracer.startActiveSpan('drizzle.driver.execute', async () => {
                span?.setAttributes({
                    'drizzle.query.text': queryString,
                    'drizzle.query.params': JSON.stringify(params),
                });
                const { rows } = await client(queryString, params, 'all', typings);
                return rows;
            });
            return tracer.startActiveSpan('drizzle.mapResponse', () => {
                return customResultMapper
                    ? customResultMapper(rows)
                    : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
            });
        });
    }
    async all() {
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
//# sourceMappingURL=session.js.map