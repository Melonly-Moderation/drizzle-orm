import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
import { types } from '@electric-sql/pglite';
export class PglitePreparedQuery extends PgPreparedQuery {
    client;
    queryString;
    params;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'PglitePreparedQuery';
    rawQueryConfig;
    queryConfig;
    constructor(client, queryString, params, logger, fields, name, _isResponseInArrayMode, customResultMapper) {
        super({ sql: queryString, params });
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.rawQueryConfig = {
            rowMode: 'object',
            parsers: {
                [types.TIMESTAMP]: (value) => value,
                [types.TIMESTAMPTZ]: (value) => value,
                [types.INTERVAL]: (value) => value,
                [types.DATE]: (value) => value,
            },
        };
        this.queryConfig = {
            rowMode: 'array',
            parsers: {
                [types.TIMESTAMP]: (value) => value,
                [types.TIMESTAMPTZ]: (value) => value,
                [types.INTERVAL]: (value) => value,
                [types.DATE]: (value) => value,
            },
        };
    }
    async execute(placeholderValues = {}) {
        const params = fillPlaceholders(this.params, placeholderValues);
        this.logger.logQuery(this.queryString, params);
        const { fields, rawQueryConfig, client, queryConfig, joinsNotNullableMap, customResultMapper, queryString } = this;
        if (!fields && !customResultMapper) {
            return client.query(queryString, params, rawQueryConfig);
        }
        const result = await client.query(queryString, params, queryConfig);
        return customResultMapper
            ? customResultMapper(result.rows)
            : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    all(placeholderValues = {}) {
        const params = fillPlaceholders(this.params, placeholderValues);
        this.logger.logQuery(this.queryString, params);
        return this.client.query(this.queryString, params, this.rawQueryConfig).then((result) => result.rows);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class PgliteSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'PgliteSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, fields, name, isResponseInArrayMode, customResultMapper);
    }
    async transaction(transaction, config) {
        return this.client.transaction(async (client) => {
            const session = new PgliteSession(client, this.dialect, this.schema, this.options);
            const tx = new PgliteTransaction(this.dialect, session, this.schema);
            if (config) {
                await tx.setTransaction(config);
            }
            return transaction(tx);
        });
    }
    async count(sql) {
        const res = await this.execute(sql);
        return Number(res['rows'][0]['count']);
    }
}
export class PgliteTransaction extends PgTransaction {
    static [entityKind] = 'PgliteTransaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new PgliteTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await tx.execute(sql.raw(`savepoint ${savepointName}`));
        try {
            const result = await transaction(tx);
            await tx.execute(sql.raw(`release savepoint ${savepointName}`));
            return result;
        }
        catch (err) {
            await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
//# sourceMappingURL=session.js.map