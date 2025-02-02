import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { getTableName, Table } from '~/table.ts';
import { tracer } from '~/tracing.ts';
import { orderSelectedFields } from '~/utils.ts';
export class PgDeleteBase extends QueryPromise {
    session;
    dialect;
    static [entityKind] = 'PgDelete';
    config;
    constructor(table, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table, withList };
    }
    /**
     * Adds a `where` clause to the query.
     *
     * Calling this method will delete only those rows that fulfill a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/delete}
     *
     * @param where the `where` clause.
     *
     * @example
     * You can use conditional operators and `sql function` to filter the rows to be deleted.
     *
     * ```ts
     * // Delete all cars with green color
     * await db.delete(cars).where(eq(cars.color, 'green'));
     * // or
     * await db.delete(cars).where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Delete all BMW cars with a green color
     * await db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Delete all cars with the green or blue color
     * await db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where) {
        this.config.where = where;
        return this;
    }
    returning(fields = this.config.table[Table.Symbol.Columns]) {
        this.config.returningFields = fields;
        this.config.returning = orderSelectedFields(fields);
        return this;
    }
    /** @internal */
    getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */
    _prepare(name) {
        return tracer.startActiveSpan('drizzle.prepareQuery', () => {
            return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true);
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
    /** @internal */
    getSelectedFields() {
        return (this.config.returningFields
            ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
                alias: getTableName(this.config.table),
                sqlAliasedBehavior: 'alias',
                sqlBehavior: 'error',
            }))
            : undefined);
    }
    $dynamic() {
        return this;
    }
}
//# sourceMappingURL=delete.js.map