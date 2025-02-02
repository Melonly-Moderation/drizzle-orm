import { entityKind } from '~/entity.ts';
import { PgDeleteBase, PgInsertBuilder, PgSelectBuilder, PgUpdateBuilder, QueryBuilder, } from '~/pg-core/query-builders/index.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { sql } from '~/sql/sql.ts';
import { WithSubquery } from '~/subquery.ts';
import { PgCountBuilder } from './query-builders/count.ts';
import { RelationalQueryBuilder } from './query-builders/query.ts';
import { PgRaw } from './query-builders/raw.ts';
import { PgRefreshMaterializedView } from './query-builders/refresh-materialized-view.ts';
export class PgDatabase {
    dialect;
    session;
    static [entityKind] = 'PgDatabase';
    query;
    constructor(
    /** @internal */
    dialect, 
    /** @internal */
    session, schema) {
        this.dialect = dialect;
        this.session = session;
        this._ = schema
            ? {
                schema: schema.schema,
                fullSchema: schema.fullSchema,
                tableNamesMap: schema.tableNamesMap,
                session,
            }
            : {
                schema: undefined,
                fullSchema: {},
                tableNamesMap: {},
                session,
            };
        this.query = {};
        if (this._.schema) {
            for (const [tableName, columns] of Object.entries(this._.schema)) {
                this.query[tableName] = new RelationalQueryBuilder(schema.fullSchema, this._.schema, this._.tableNamesMap, schema.fullSchema[tableName], columns, dialect, session);
            }
        }
    }
    /**
     * Creates a subquery that defines a temporary named result set as a CTE.
     *
     * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param alias The alias for the subquery.
     *
     * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
     *
     * @example
     *
     * ```ts
     * // Create a subquery with alias 'sq' and use it in the select query
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * const result = await db.with(sq).select().from(sq);
     * ```
     *
     * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
     *
     * ```ts
     * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
     * const sq = db.$with('sq').as(db.select({
     *   name: sql<string>`upper(${users.name})`.as('name'),
     * })
     * .from(users));
     *
     * const result = await db.with(sq).select({ name: sq.name }).from(sq);
     * ```
     */
    $with = (alias, selection) => {
        const self = this;
        const as = (qb) => {
            if (typeof qb === 'function') {
                qb = qb(new QueryBuilder(self.dialect));
            }
            return new Proxy(new WithSubquery(qb.getSQL(), selection ?? ('getSelectedFields' in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: 'alias', sqlBehavior: 'error' }));
        };
        return { as };
    };
    $count(source, filters) {
        return new PgCountBuilder({ source, filters, session: this.session });
    }
    /**
     * Incorporates a previously defined CTE (using `$with`) into the main query.
     *
     * This method allows the main query to reference a temporary named result set.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param queries The CTEs to incorporate into the main query.
     *
     * @example
     *
     * ```ts
     * // Define a subquery 'sq' as a CTE using $with
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * // Incorporate the CTE 'sq' into the main query and select from it
     * const result = await db.with(sq).select().from(sq);
     * ```
     */
    with(...queries) {
        const self = this;
        function select(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
            });
        }
        function selectDistinct(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
                distinct: true,
            });
        }
        function selectDistinctOn(on, fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: self.session,
                dialect: self.dialect,
                withList: queries,
                distinct: { on },
            });
        }
        /**
         * Creates an update query.
         *
         * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
         *
         * Use `.set()` method to specify which values to update.
         *
         * See docs: {@link https://orm.drizzle.team/docs/update}
         *
         * @param table The table to update.
         *
         * @example
         *
         * ```ts
         * // Update all rows in the 'cars' table
         * await db.update(cars).set({ color: 'red' });
         *
         * // Update rows with filters and conditions
         * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
         *
         * // Update with returning clause
         * const updatedCar: Car[] = await db.update(cars)
         *   .set({ color: 'red' })
         *   .where(eq(cars.id, 1))
         *   .returning();
         * ```
         */
        function update(table) {
            return new PgUpdateBuilder(table, self.session, self.dialect, queries);
        }
        /**
         * Creates an insert query.
         *
         * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
         *
         * See docs: {@link https://orm.drizzle.team/docs/insert}
         *
         * @param table The table to insert into.
         *
         * @example
         *
         * ```ts
         * // Insert one row
         * await db.insert(cars).values({ brand: 'BMW' });
         *
         * // Insert multiple rows
         * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
         *
         * // Insert with returning clause
         * const insertedCar: Car[] = await db.insert(cars)
         *   .values({ brand: 'BMW' })
         *   .returning();
         * ```
         */
        function insert(table) {
            return new PgInsertBuilder(table, self.session, self.dialect, queries);
        }
        /**
         * Creates a delete query.
         *
         * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
         *
         * See docs: {@link https://orm.drizzle.team/docs/delete}
         *
         * @param table The table to delete from.
         *
         * @example
         *
         * ```ts
         * // Delete all rows in the 'cars' table
         * await db.delete(cars);
         *
         * // Delete rows with filters and conditions
         * await db.delete(cars).where(eq(cars.color, 'green'));
         *
         * // Delete with returning clause
         * const deletedCar: Car[] = await db.delete(cars)
         *   .where(eq(cars.id, 1))
         *   .returning();
         * ```
         */
        function delete_(table) {
            return new PgDeleteBase(table, self.session, self.dialect, queries);
        }
        return { select, selectDistinct, selectDistinctOn, update, insert, delete: delete_ };
    }
    select(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
        });
    }
    selectDistinct(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
            distinct: true,
        });
    }
    selectDistinctOn(on, fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: this.session,
            dialect: this.dialect,
            distinct: { on },
        });
    }
    /**
     * Creates an update query.
     *
     * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
     *
     * Use `.set()` method to specify which values to update.
     *
     * See docs: {@link https://orm.drizzle.team/docs/update}
     *
     * @param table The table to update.
     *
     * @example
     *
     * ```ts
     * // Update all rows in the 'cars' table
     * await db.update(cars).set({ color: 'red' });
     *
     * // Update rows with filters and conditions
     * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
     *
     * // Update with returning clause
     * const updatedCar: Car[] = await db.update(cars)
     *   .set({ color: 'red' })
     *   .where(eq(cars.id, 1))
     *   .returning();
     * ```
     */
    update(table) {
        return new PgUpdateBuilder(table, this.session, this.dialect);
    }
    /**
     * Creates an insert query.
     *
     * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert}
     *
     * @param table The table to insert into.
     *
     * @example
     *
     * ```ts
     * // Insert one row
     * await db.insert(cars).values({ brand: 'BMW' });
     *
     * // Insert multiple rows
     * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
     *
     * // Insert with returning clause
     * const insertedCar: Car[] = await db.insert(cars)
     *   .values({ brand: 'BMW' })
     *   .returning();
     * ```
     */
    insert(table) {
        return new PgInsertBuilder(table, this.session, this.dialect);
    }
    /**
     * Creates a delete query.
     *
     * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
     *
     * See docs: {@link https://orm.drizzle.team/docs/delete}
     *
     * @param table The table to delete from.
     *
     * @example
     *
     * ```ts
     * // Delete all rows in the 'cars' table
     * await db.delete(cars);
     *
     * // Delete rows with filters and conditions
     * await db.delete(cars).where(eq(cars.color, 'green'));
     *
     * // Delete with returning clause
     * const deletedCar: Car[] = await db.delete(cars)
     *   .where(eq(cars.id, 1))
     *   .returning();
     * ```
     */
    delete(table) {
        return new PgDeleteBase(table, this.session, this.dialect);
    }
    refreshMaterializedView(view) {
        return new PgRefreshMaterializedView(view, this.session, this.dialect);
    }
    authToken;
    execute(query) {
        const sequel = typeof query === 'string' ? sql.raw(query) : query.getSQL();
        const builtQuery = this.dialect.sqlToQuery(sequel);
        const prepared = this.session.prepareQuery(builtQuery, undefined, undefined, false);
        return new PgRaw(() => prepared.execute(undefined, this.authToken), sequel, builtQuery, (result) => prepared.mapResult(result, true));
    }
    transaction(transaction, config) {
        return this.session.transaction(transaction, config);
    }
}
export const withReplicas = (primary, replicas, getReplica = () => replicas[Math.floor(Math.random() * replicas.length)]) => {
    const select = (...args) => getReplica(replicas).select(...args);
    const selectDistinct = (...args) => getReplica(replicas).selectDistinct(...args);
    const selectDistinctOn = (...args) => getReplica(replicas).selectDistinctOn(...args);
    const $count = (...args) => getReplica(replicas).$count(...args);
    const _with = (...args) => getReplica(replicas).with(...args);
    const $with = (arg) => getReplica(replicas).$with(arg);
    const update = (...args) => primary.update(...args);
    const insert = (...args) => primary.insert(...args);
    const $delete = (...args) => primary.delete(...args);
    const execute = (...args) => primary.execute(...args);
    const transaction = (...args) => primary.transaction(...args);
    const refreshMaterializedView = (...args) => primary.refreshMaterializedView(...args);
    return {
        ...primary,
        update,
        insert,
        delete: $delete,
        execute,
        transaction,
        refreshMaterializedView,
        $primary: primary,
        select,
        selectDistinct,
        selectDistinctOn,
        $count,
        $with,
        with: _with,
        get query() {
            return getReplica(replicas).query;
        },
    };
};
//# sourceMappingURL=db.js.map