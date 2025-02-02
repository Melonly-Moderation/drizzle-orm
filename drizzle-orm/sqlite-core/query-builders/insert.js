import { entityKind, is } from '~/entity.ts';
import { QueryPromise } from '~/query-promise.ts';
import { Param, SQL, sql } from '~/sql/sql.ts';
import { SQLiteTable } from '~/sqlite-core/table.ts';
import { Columns, Table } from '~/table.ts';
import { haveSameKeys, mapUpdateSet, orderSelectedFields } from '~/utils.ts';
import { QueryBuilder } from './query-builder.ts';
export class SQLiteInsertBuilder {
    table;
    session;
    dialect;
    withList;
    static [entityKind] = 'SQLiteInsertBuilder';
    constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
    }
    values(values) {
        values = Array.isArray(values) ? values : [values];
        if (values.length === 0) {
            throw new Error('values() must be called with at least one value');
        }
        const mappedValues = values.map((entry) => {
            const result = {};
            const cols = this.table[Table.Symbol.Columns];
            for (const colKey of Object.keys(entry)) {
                const colValue = entry[colKey];
                result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
            }
            return result;
        });
        // if (mappedValues.length > 1 && mappedValues.some((t) => Object.keys(t).length === 0)) {
        // 	throw new Error(
        // 		`One of the values you want to insert is empty. In SQLite you can insert only one empty object per statement. For this case Drizzle with use "INSERT INTO ... DEFAULT VALUES" syntax`,
        // 	);
        // }
        return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
    }
    select(selectQuery) {
        const select = typeof selectQuery === 'function' ? selectQuery(new QueryBuilder()) : selectQuery;
        if (!is(select, SQL)
            && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
            throw new Error('Insert select error: selected fields are not the same or are in a different order compared to the table definition');
        }
        return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
    }
}
export class SQLiteInsertBase extends QueryPromise {
    session;
    dialect;
    static [entityKind] = 'SQLiteInsert';
    /** @internal */
    config;
    constructor(table, values, session, dialect, withList, select) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table, values: values, withList, select };
    }
    returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
    }
    /**
     * Adds an `on conflict do nothing` clause to the query.
     *
     * Calling this method simply avoids inserting a row as its alternative action.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
     *
     * @param config The `target` and `where` clauses.
     *
     * @example
     * ```ts
     * // Insert one row and cancel the insert if there's a conflict
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoNothing();
     *
     * // Explicitly specify conflict target
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoNothing({ target: cars.id });
     * ```
     */
    onConflictDoNothing(config = {}) {
        if (!this.config.onConflict)
            this.config.onConflict = [];
        if (config.target === undefined) {
            this.config.onConflict.push(sql ` on conflict do nothing`);
        }
        else {
            const targetSql = Array.isArray(config.target) ? sql `${config.target}` : sql `${[config.target]}`;
            const whereSql = config.where ? sql ` where ${config.where}` : sql ``;
            this.config.onConflict.push(sql ` on conflict ${targetSql} do nothing${whereSql}`);
        }
        return this;
    }
    /**
     * Adds an `on conflict do update` clause to the query.
     *
     * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
     *
     * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
     *
     * @param config The `target`, `set` and `where` clauses.
     *
     * @example
     * ```ts
     * // Update the row if there's a conflict
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoUpdate({
     *     target: cars.id,
     *     set: { brand: 'Porsche' }
     *   });
     *
     * // Upsert with 'where' clause
     * await db.insert(cars)
     *   .values({ id: 1, brand: 'BMW' })
     *   .onConflictDoUpdate({
     *     target: cars.id,
     *     set: { brand: 'newBMW' },
     *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
     *   });
     * ```
     */
    onConflictDoUpdate(config) {
        if (config.where && (config.targetWhere || config.setWhere)) {
            throw new Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
        }
        if (!this.config.onConflict)
            this.config.onConflict = [];
        const whereSql = config.where ? sql ` where ${config.where}` : undefined;
        const targetWhereSql = config.targetWhere ? sql ` where ${config.targetWhere}` : undefined;
        const setWhereSql = config.setWhere ? sql ` where ${config.setWhere}` : undefined;
        const targetSql = Array.isArray(config.target) ? sql `${config.target}` : sql `${[config.target]}`;
        const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
        this.config.onConflict.push(sql ` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`);
        return this;
    }
    /** @internal */
    getSQL() {
        return this.dialect.buildInsertQuery(this.config);
    }
    toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
    }
    /** @internal */
    _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? 'prepareOneTimeQuery' : 'prepareQuery'](this.dialect.sqlToQuery(this.getSQL()), this.config.returning, this.config.returning ? 'all' : 'run', true);
    }
    prepare() {
        return this._prepare(false);
    }
    run = (placeholderValues) => {
        return this._prepare().run(placeholderValues);
    };
    all = (placeholderValues) => {
        return this._prepare().all(placeholderValues);
    };
    get = (placeholderValues) => {
        return this._prepare().get(placeholderValues);
    };
    values = (placeholderValues) => {
        return this._prepare().values(placeholderValues);
    };
    async execute() {
        return (this.config.returning ? this.all() : this.run());
    }
    $dynamic() {
        return this;
    }
}
//# sourceMappingURL=insert.js.map