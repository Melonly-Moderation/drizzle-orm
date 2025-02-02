import pg from 'pg';
import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { tracer } from '~/tracing.ts';
import { mapResultRow } from '~/utils.ts';
const { Pool, types } = pg;
export class NodePgPreparedQuery extends PgPreparedQuery {
    client;
    params;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'NodePgPreparedQuery';
    rawQueryConfig;
    queryConfig;
    constructor(client, queryString, params, logger, fields, name, _isResponseInArrayMode, customResultMapper) {
        super({ sql: queryString, params });
        this.client = client;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.rawQueryConfig = {
            name,
            text: queryString,
            types: {
                // @ts-ignore
                getTypeParser: (typeId, format) => {
                    if (typeId === types.builtins.TIMESTAMPTZ) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.TIMESTAMP) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.DATE) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.INTERVAL) {
                        return (val) => val;
                    }
                    // @ts-ignore
                    return types.getTypeParser(typeId, format);
                },
            },
        };
        this.queryConfig = {
            name,
            text: queryString,
            rowMode: 'array',
            types: {
                // @ts-ignore
                getTypeParser: (typeId, format) => {
                    if (typeId === types.builtins.TIMESTAMPTZ) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.TIMESTAMP) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.DATE) {
                        return (val) => val;
                    }
                    if (typeId === types.builtins.INTERVAL) {
                        return (val) => val;
                    }
                    // @ts-ignore
                    return types.getTypeParser(typeId, format);
                },
            },
        };
    }
    async execute(placeholderValues = {}) {
        return tracer.startActiveSpan('drizzle.execute', async () => {
            const params = fillPlaceholders(this.params, placeholderValues);
            this.logger.logQuery(this.rawQueryConfig.text, params);
            const { fields, rawQueryConfig: rawQuery, client, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
            if (!fields && !customResultMapper) {
                return tracer.startActiveSpan('drizzle.driver.execute', async (span) => {
                    span?.setAttributes({
                        'drizzle.query.name': rawQuery.name,
                        'drizzle.query.text': rawQuery.text,
                        'drizzle.query.params': JSON.stringify(params),
                    });
                    return client.query(rawQuery, params);
                });
            }
            const result = await tracer.startActiveSpan('drizzle.driver.execute', (span) => {
                span?.setAttributes({
                    'drizzle.query.name': query.name,
                    'drizzle.query.text': query.text,
                    'drizzle.query.params': JSON.stringify(params),
                });
                return client.query(query, params);
            });
            return tracer.startActiveSpan('drizzle.mapResponse', () => {
                return customResultMapper
                    ? customResultMapper(result.rows)
                    : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
            });
        });
    }
    all(placeholderValues = {}) {
        return tracer.startActiveSpan('drizzle.execute', () => {
            const params = fillPlaceholders(this.params, placeholderValues);
            this.logger.logQuery(this.rawQueryConfig.text, params);
            return tracer.startActiveSpan('drizzle.driver.execute', (span) => {
                span?.setAttributes({
                    'drizzle.query.name': this.rawQueryConfig.name,
                    'drizzle.query.text': this.rawQueryConfig.text,
                    'drizzle.query.params': JSON.stringify(params),
                });
                return this.client.query(this.rawQueryConfig, params).then((result) => result.rows);
            });
        });
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class NodePgSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'NodePgSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new NodePgPreparedQuery(this.client, query.sql, query.params, this.logger, fields, name, isResponseInArrayMode, customResultMapper);
    }
    async transaction(transaction, config) {
        const session = this.client instanceof Pool // eslint-disable-line no-instanceof/no-instanceof
            ? new NodePgSession(await this.client.connect(), this.dialect, this.schema, this.options)
            : this;
        const tx = new NodePgTransaction(this.dialect, session, this.schema);
        await tx.execute(sql `begin${config ? sql ` ${tx.getTransactionConfigSQL(config)}` : undefined}`);
        try {
            const result = await transaction(tx);
            await tx.execute(sql `commit`);
            return result;
        }
        catch (error) {
            await tx.execute(sql `rollback`);
            throw error;
        }
        finally {
            if (this.client instanceof Pool) { // eslint-disable-line no-instanceof/no-instanceof
                session.client.release();
            }
        }
    }
    async count(sql) {
        const res = await this.execute(sql);
        return Number(res['rows'][0]['count']);
    }
}
export class NodePgTransaction extends PgTransaction {
    static [entityKind] = 'NodePgTransaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new NodePgTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
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