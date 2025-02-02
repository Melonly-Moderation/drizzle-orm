import { types, VercelPool, } from '@vercel/postgres';
import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders, sql } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
export class VercelPgPreparedQuery extends PgPreparedQuery {
    client;
    params;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'VercelPgPreparedQuery';
    rawQuery;
    queryConfig;
    constructor(client, queryString, params, logger, fields, name, _isResponseInArrayMode, customResultMapper) {
        super({ sql: queryString, params });
        this.client = client;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.rawQuery = {
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
        const params = fillPlaceholders(this.params, placeholderValues);
        this.logger.logQuery(this.rawQuery.text, params);
        const { fields, rawQuery, client, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return client.query(rawQuery, params);
        }
        const { rows } = await client.query(query, params);
        if (customResultMapper) {
            return customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
    }
    all(placeholderValues = {}) {
        const params = fillPlaceholders(this.params, placeholderValues);
        this.logger.logQuery(this.rawQuery.text, params);
        return this.client.query(this.rawQuery, params).then((result) => result.rows);
    }
    values(placeholderValues = {}) {
        const params = fillPlaceholders(this.params, placeholderValues);
        this.logger.logQuery(this.rawQuery.text, params);
        return this.client.query(this.queryConfig, params).then((result) => result.rows);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class VercelPgSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'VercelPgSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new VercelPgPreparedQuery(this.client, query.sql, query.params, this.logger, fields, name, isResponseInArrayMode, customResultMapper);
    }
    async query(query, params) {
        this.logger.logQuery(query, params);
        const result = await this.client.query({
            rowMode: 'array',
            text: query,
            values: params,
        });
        return result;
    }
    async queryObjects(query, params) {
        return this.client.query(query, params);
    }
    async count(sql) {
        const result = await this.execute(sql);
        return Number(result['rows'][0]['count']);
    }
    async transaction(transaction, config) {
        const session = this.client instanceof VercelPool // eslint-disable-line no-instanceof/no-instanceof
            ? new VercelPgSession(await this.client.connect(), this.dialect, this.schema, this.options)
            : this;
        const tx = new VercelPgTransaction(this.dialect, session, this.schema);
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
            if (this.client instanceof VercelPool) { // eslint-disable-line no-instanceof/no-instanceof
                session.client.release();
            }
        }
    }
}
export class VercelPgTransaction extends PgTransaction {
    static [entityKind] = 'VercelPgTransaction';
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new VercelPgTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
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