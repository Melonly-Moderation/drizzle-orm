import { QueryPromise } from '~/query-promise.ts';
import type { RunnableQuery } from '~/runnable-query.ts';
import type { PreparedQuery } from '~/session.ts';
import type { SQL, SQLWrapper } from '~/sql/sql.ts';
import type { SQLiteAsyncDialect } from '../dialect.ts';
type SQLiteRawAction = 'all' | 'get' | 'values' | 'run';
export interface SQLiteRawConfig {
    action: SQLiteRawAction;
}
export interface SQLiteRaw<TResult> extends QueryPromise<TResult>, RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
}
export declare class SQLiteRaw<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper, PreparedQuery {
    static readonly [x: number]: string;
    execute: () => Promise<TResult>;
    private dialect;
    private mapBatchResult;
    readonly _: {
        readonly dialect: 'sqlite';
        readonly result: TResult;
    };
    constructor(execute: () => Promise<TResult>, 
    /** @internal */
    getSQL: () => SQL, action: SQLiteRawAction, dialect: SQLiteAsyncDialect, mapBatchResult: (result: unknown) => unknown);
    getQuery(): any;
    mapResult(result: unknown, isFromBatch?: boolean): unknown;
    _prepare(): PreparedQuery;
}
export {};
