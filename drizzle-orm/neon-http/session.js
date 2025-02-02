import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgTransaction } from '~/pg-core/index.ts';
import { PgPreparedQuery as PgPreparedQuery, PgSession } from '~/pg-core/session.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
const rawQueryConfig = {
    arrayMode: false,
    fullResults: true,
};
const queryConfig = {
    arrayMode: true,
    fullResults: true,
};
export class NeonHttpPreparedQuery extends PgPreparedQuery {
    client;
    logger;
    fields;
    _isResponseInArrayMode;
    customResultMapper;
    static [entityKind] = 'NeonHttpPreparedQuery';
    constructor(client, query, logger, fields, _isResponseInArrayMode, customResultMapper) {
        super(query);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
    }
    /** @internal */
    async execute(placeholderValues = {}, token = this.authToken) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        const { fields, client, query, customResultMapper } = this;
        if (!fields && !customResultMapper) {
            return client(query.sql, params, token === undefined
                ? rawQueryConfig
                : {
                    ...rawQueryConfig,
                    authToken: token,
                });
        }
        const result = await client(query.sql, params, token === undefined
            ? queryConfig
            : {
                ...queryConfig,
                authToken: token,
            });
        return this.mapResult(result);
    }
    mapResult(result) {
        if (!this.fields && !this.customResultMapper) {
            return result;
        }
        const rows = result.rows;
        if (this.customResultMapper) {
            return this.customResultMapper(rows);
        }
        return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
    }
    all(placeholderValues = {}) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client(this.query.sql, params, this.authToken === undefined ? rawQueryConfig : {
            ...rawQueryConfig,
            authToken: this.authToken,
        }).then((result) => result.rows);
    }
    /** @internal */
    values(placeholderValues = {}, token) {
        const params = fillPlaceholders(this.query.params, placeholderValues);
        this.logger.logQuery(this.query.sql, params);
        return this.client(this.query.sql, params, { arrayMode: true, fullResults: true, authToken: token }).then((result) => result.rows);
    }
    /** @internal */
    isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
export class NeonHttpSession extends PgSession {
    client;
    schema;
    options;
    static [entityKind] = 'NeonHttpSession';
    logger;
    constructor(client, dialect, schema, options = {}) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper) {
        return new NeonHttpPreparedQuery(this.client, query, this.logger, fields, isResponseInArrayMode, customResultMapper);
    }
    async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
            const preparedQuery = query._prepare();
            const builtQuery = preparedQuery.getQuery();
            preparedQueries.push(preparedQuery);
            builtQueries.push(this.client(builtQuery.sql, builtQuery.params, {
                fullResults: true,
                arrayMode: preparedQuery.isResponseInArrayMode(),
            }));
        }
        const batchResults = await this.client.transaction(builtQueries, queryConfig);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
    }
    // change return type to QueryRows<true>
    async query(query, params) {
        this.logger.logQuery(query, params);
        const result = await this.client(query, params, { arrayMode: true, fullResults: true });
        return result;
    }
    // change return type to QueryRows<false>
    async queryObjects(query, params) {
        return this.client(query, params, { arrayMode: false, fullResults: true });
    }
    /** @internal */
    async count(sql, token) {
        const res = await this.execute(sql, token);
        return Number(res['rows'][0]['count']);
    }
    async transaction(_transaction, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _config = {}) {
        throw new Error('No transactions support in neon-http driver');
    }
}
export class NeonTransaction extends PgTransaction {
    static [entityKind] = 'NeonHttpTransaction';
    async transaction(_transaction) {
        throw new Error('No transactions support in neon-http driver');
        // const savepointName = `sp${this.nestedIndex + 1}`;
        // const tx = new NeonTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
        // await tx.execute(sql.raw(`savepoint ${savepointName}`));
        // try {
        // 	const result = await transaction(tx);
        // 	await tx.execute(sql.raw(`release savepoint ${savepointName}`));
        // 	return result;
        // } catch (e) {
        // 	await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
        // 	throw e;
        // }
    }
}
//# sourceMappingURL=session.js.map