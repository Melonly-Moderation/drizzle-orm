import { entityKind } from '~/entity.ts';
import { SQL, sql } from '~/sql/sql.ts';
export class PgCountBuilder extends SQL {
    params;
    sql;
    token;
    static [entityKind] = 'PgCountBuilder';
    [Symbol.toStringTag] = 'PgCountBuilder';
    session;
    static buildEmbeddedCount(source, filters) {
        return sql `(select count(*) from ${source}${sql.raw(' where ').if(filters)}${filters})`;
    }
    static buildCount(source, filters) {
        return sql `select count(*) as count from ${source}${sql.raw(' where ').if(filters)}${filters};`;
    }
    constructor(params) {
        super(PgCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this.params = params;
        this.mapWith(Number);
        this.session = params.session;
        this.sql = PgCountBuilder.buildCount(params.source, params.filters);
    }
    /** @intrnal */
    setToken(token) {
        this.token = token;
        return this;
    }
    then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql, this.token))
            .then(onfulfilled, onrejected);
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally(onFinally) {
        return this.then((value) => {
            onFinally?.();
            return value;
        }, (reason) => {
            onFinally?.();
            throw reason;
        });
    }
}
//# sourceMappingURL=count.js.map