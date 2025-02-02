import { entityKind } from '~/entity.ts';
import { SQL, sql } from '~/sql/sql.ts';
export class SQLiteCountBuilder extends SQL {
    params;
    sql;
    static [entityKind] = 'SQLiteCountBuilderAsync';
    [Symbol.toStringTag] = 'SQLiteCountBuilderAsync';
    session;
    static buildEmbeddedCount(source, filters) {
        return sql `(select count(*) from ${source}${sql.raw(' where ').if(filters)}${filters})`;
    }
    static buildCount(source, filters) {
        return sql `select count(*) from ${source}${sql.raw(' where ').if(filters)}${filters}`;
    }
    constructor(params) {
        super(SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this.params = params;
        this.session = params.session;
        this.sql = SQLiteCountBuilder.buildCount(params.source, params.filters);
    }
    then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql)).then(onfulfilled, onrejected);
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