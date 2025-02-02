import type { PgDialect } from '~/pg-core/dialect.ts';
import type { PgPreparedQuery, PgQueryResultHKT, PgQueryResultKind, PgSession, PreparedQueryConfig } from '~/pg-core/session.ts';
import type { PgMaterializedView } from '~/pg-core/view.ts';
import { QueryPromise } from '~/query-promise.ts';
import type { RunnableQuery } from '~/runnable-query.ts';
import type { Query, SQLWrapper } from '~/sql/sql.ts';
export interface PgRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends QueryPromise<PgQueryResultKind<TQueryResult, never>>, RunnableQuery<PgQueryResultKind<TQueryResult, never>, 'pg'>, SQLWrapper {
    readonly _: {
        readonly dialect: 'pg';
        readonly result: PgQueryResultKind<TQueryResult, never>;
    };
}
export declare class PgRefreshMaterializedView<TQueryResult extends PgQueryResultHKT> extends QueryPromise<PgQueryResultKind<TQueryResult, never>> implements RunnableQuery<PgQueryResultKind<TQueryResult, never>, 'pg'>, SQLWrapper {
    static readonly [x: number]: string;
    private session;
    private dialect;
    private config;
    constructor(view: PgMaterializedView, session: PgSession, dialect: PgDialect);
    concurrently(): this;
    withNoData(): this;
    toSQL(): Query;
    prepare(name: string): PgPreparedQuery<PreparedQueryConfig & {
        execute: PgQueryResultKind<TQueryResult, never>;
    }>;
    private authToken?;
    execute: ReturnType<this['prepare']>['execute'];
}
