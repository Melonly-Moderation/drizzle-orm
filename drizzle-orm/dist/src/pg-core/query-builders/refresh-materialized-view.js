import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
import { tracer } from '~/tracing.ts';
export class PgRefreshMaterializedView extends QueryPromise {
    session;
    dialect;
    static [entityKind] = 'PgRefreshMaterializedView';
    config;
    constructor(view, session, dialect) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { view };
    }
    concurrently() {
        if (this.config.withNoData !== undefined) {
            throw new Error('Cannot use concurrently and withNoData together');
        }
        this.config.concurrently = true;
        return this;
    }
    withNoData() {
        if (this.config.concurrently !== undefined) {
            throw new Error('Cannot use concurrently and withNoData together');
        }
        this.config.withNoData = true;
        return this;
    }
    /** @internal */
    getSQL() {
        return this.dialect.buildRefreshMaterializedViewQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */
    _prepare(name) {
        return tracer.startActiveSpan('drizzle.prepareQuery', () => {
            return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), undefined, name, true);
        });
    }
    prepare(name) {
        return this._prepare(name);
    }
    authToken;
    /** @internal */
    setToken(token) {
        this.authToken = token;
        return this;
    }
    execute = (placeholderValues) => {
        return tracer.startActiveSpan('drizzle.operation', () => {
            return this._prepare().execute(placeholderValues, this.authToken);
        });
    };
}
//# sourceMappingURL=refresh-materialized-view.js.map