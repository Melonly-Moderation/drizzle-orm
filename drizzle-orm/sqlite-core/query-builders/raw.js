import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
export class SQLiteRaw extends QueryPromise {
    execute;
    getSQL;
    dialect;
    mapBatchResult;
    static [entityKind] = 'SQLiteRaw';
    /** @internal */
    config;
    constructor(execute, 
    /** @internal */
    getSQL, action, dialect, mapBatchResult) {
        super();
        this.execute = execute;
        this.getSQL = getSQL;
        this.dialect = dialect;
        this.mapBatchResult = mapBatchResult;
        this.config = { action };
    }
    getQuery() {
        return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
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