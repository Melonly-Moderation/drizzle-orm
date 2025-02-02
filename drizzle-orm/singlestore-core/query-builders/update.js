import { entityKind } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { Table } from '~/table.ts';
import { mapUpdateSet } from '~/utils.ts';
export class SingleStoreUpdateBuilder {
    table;
    session;
    dialect;
    withList;
    static [entityKind] = 'SingleStoreUpdateBuilder';
    constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
    }
    set(values) {
        return new SingleStoreUpdateBase(this.table, mapUpdateSet(this.table, values), this.session, this.dialect, this.withList);
    }
}
export class SingleStoreUpdateBase extends QueryPromise {
    session;
    dialect;
    static [entityKind] = 'SingleStoreUpdate';
    config;
    constructor(table, set, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { set, table, withList };
    }
    /**
     * Adds a 'where' clause to the query.
     *
     * Calling this method will update only those rows that fulfill a specified condition.
     *
     * See docs: {@link https://orm.drizzle.team/docs/update}
     *
     * @param where the 'where' clause.
     *
     * @example
     * You can use conditional operators and `sql function` to filter the rows to be updated.
     *
     * ```ts
     * // Update all cars with green color
     * db.update(cars).set({ color: 'red' })
     *   .where(eq(cars.color, 'green'));
     * // or
     * db.update(cars).set({ color: 'red' })
     *   .where(sql`${cars.color} = 'green'`)
     * ```
     *
     * You can logically combine conditional operators with `and()` and `or()` operators:
     *
     * ```ts
     * // Update all BMW cars with a green color
     * db.update(cars).set({ color: 'red' })
     *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
     *
     * // Update all cars with the green or blue color
     * db.update(cars).set({ color: 'red' })
     *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
     * ```
     */
    where(where) {
        this.config.where = where;
        return this;
    }
    orderBy(...columns) {
        if (typeof columns[0] === 'function') {
            const orderBy = columns[0](new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({ sqlAliasedBehavior: 'alias', sqlBehavior: 'sql' })));
            const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
            this.config.orderBy = orderByArray;
        }
        else {
            const orderByArray = columns;
            this.config.orderBy = orderByArray;
        }
        return this;
    }
    limit(limit) {
        this.config.limit = limit;
        return this;
    }
    /** @internal */
    getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    prepare() {
        return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning);
    }
    execute = (placeholderValues) => {
        return this.prepare().execute(placeholderValues);
    };
    createIterator = () => {
        const self = this;
        return async function* (placeholderValues) {
            yield* self.prepare().iterator(placeholderValues);
        };
    };
    iterator = this.createIterator();
    $dynamic() {
        return this;
    }
}
//# sourceMappingURL=update.js.map