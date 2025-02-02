import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
export class PgRaw extends QueryPromise {
    execute;
    sql;
    query;
    mapBatchResult;
    static [entityKind] = 'PgRaw';
    constructor(execute, sql, query, mapBatchResult) {
        super();
        this.execute = execute;
        this.sql = sql;
        this.query = query;
        this.mapBatchResult = mapBatchResult;
    }
    /** @internal */
    getSQL() {
        return this.sql;
    }
    getQuery() {
        return this.query;
    }
    mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
    }
    _prepare() {
        return this;
    }
    /** @internal */
    isResponseInArrayMode() {
        return false;
    }
}
//# sourceMappingURL=raw.js.map