import { entityKind } from '~/entity.ts';
import { TransactionRollbackError } from '~/errors.ts';
import { sql } from '~/sql/index.ts';
import { tracer } from '~/tracing.ts';
import { PgDatabase } from './db.ts';
export class PgPreparedQuery {
    query;
    constructor(query) {
        this.query = query;
    }
    authToken;
    getQuery() {
        return this.query;
    }
    mapResult(response, _isFromBatch) {
        return response;
    }
    /** @internal */
    setToken(token) {
        this.authToken = token;
        return this;
    }
    static [entityKind] = 'PgPreparedQuery';
    /** @internal */
    joinsNotNullableMap;
}
export class PgSession {
    dialect;
    static [entityKind] = 'PgSession';
    constructor(dialect) {
        this.dialect = dialect;
    }
    /** @internal */
    execute(query, token) {
        return tracer.startActiveSpan('drizzle.operation', () => {
            const prepared = tracer.startActiveSpan('drizzle.prepareQuery', () => {
                return this.prepareQuery(this.dialect.sqlToQuery(query), undefined, undefined, false);
            });
            return prepared.setToken(token).execute(undefined, token);
        });
    }
    all(query) {
        return this.prepareQuery(this.dialect.sqlToQuery(query), undefined, undefined, false).all();
    }
    /** @internal */
    async count(sql, token) {
        const res = await this.execute(sql, token);
        return Number(res[0]['count']);
    }
}
export class PgTransaction extends PgDatabase {
    schema;
    nestedIndex;
    static [entityKind] = 'PgTransaction';
    constructor(dialect, session, schema, nestedIndex = 0) {
        super(dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
    }
    rollback() {
        throw new TransactionRollbackError();
    }
    /** @internal */
    getTransactionConfigSQL(config) {
        const chunks = [];
        if (config.isolationLevel) {
            chunks.push(`isolation level ${config.isolationLevel}`);
        }
        if (config.accessMode) {
            chunks.push(config.accessMode);
        }
        if (typeof config.deferrable === 'boolean') {
            chunks.push(config.deferrable ? 'deferrable' : 'not deferrable');
        }
        return sql.raw(chunks.join(' '));
    }
    setTransaction(config) {
        return this.session.execute(sql `set transaction ${this.getTransactionConfigSQL(config)}`);
    }
}
//# sourceMappingURL=session.js.map