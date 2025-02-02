import { entityKind } from '~/entity.ts';
import { DrizzleError, TransactionRollbackError } from '~/errors.ts';
// import { QueryPromise } from '../index.ts';
import { QueryPromise } from '~/query-promise.ts';
import { BaseSQLiteDatabase } from './db.ts';
export class ExecuteResultSync extends QueryPromise {
    resultCb;
    static [entityKind] = 'ExecuteResultSync';
    constructor(resultCb) {
        super();
        this.resultCb = resultCb;
    }
    async execute() {
        return this.resultCb();
    }
    sync() {
        return this.resultCb();
    }
}
export class SQLitePreparedQuery {
    mode;
    executeMethod;
    query;
    static [entityKind] = 'PreparedQuery';
    /** @internal */
    joinsNotNullableMap;
    constructor(mode, executeMethod, query) {
        this.mode = mode;
        this.executeMethod = executeMethod;
        this.query = query;
    }
    getQuery() {
        return this.query;
    }
    mapRunResult(result, _isFromBatch) {
        return result;
    }
    mapAllResult(_result, _isFromBatch) {
        throw new Error('Not implemented');
    }
    mapGetResult(_result, _isFromBatch) {
        throw new Error('Not implemented');
    }
    execute(placeholderValues) {
        if (this.mode === 'async') {
            return this[this.executeMethod](placeholderValues);
        }
        return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
    }
    mapResult(response, isFromBatch) {
        switch (this.executeMethod) {
            case 'run': {
                return this.mapRunResult(response, isFromBatch);
            }
            case 'all': {
                return this.mapAllResult(response, isFromBatch);
            }
            case 'get': {
                return this.mapGetResult(response, isFromBatch);
            }
        }
    }
}
export class SQLiteSession {
    dialect;
    static [entityKind] = 'SQLiteSession';
    constructor(
    /** @internal */
    dialect) {
        this.dialect = dialect;
    }
    prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode) {
        return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode);
    }
    run(query) {
        const staticQuery = this.dialect.sqlToQuery(query);
        try {
            return this.prepareOneTimeQuery(staticQuery, undefined, 'run', false).run();
        }
        catch (err) {
            throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
        }
    }
    /** @internal */
    extractRawRunValueFromBatchResult(result) {
        return result;
    }
    all(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), undefined, 'run', false).all();
    }
    /** @internal */
    extractRawAllValueFromBatchResult(_result) {
        throw new Error('Not implemented');
    }
    get(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), undefined, 'run', false).get();
    }
    /** @internal */
    extractRawGetValueFromBatchResult(_result) {
        throw new Error('Not implemented');
    }
    values(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), undefined, 'run', false).values();
    }
    async count(sql) {
        const result = await this.values(sql);
        return result[0][0];
    }
    /** @internal */
    extractRawValuesValueFromBatchResult(_result) {
        throw new Error('Not implemented');
    }
}
export class SQLiteTransaction extends BaseSQLiteDatabase {
    schema;
    nestedIndex;
    static [entityKind] = 'SQLiteTransaction';
    constructor(resultType, dialect, session, schema, nestedIndex = 0) {
        super(resultType, dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
    }
    rollback() {
        throw new TransactionRollbackError();
    }
}
//# sourceMappingURL=session.js.map