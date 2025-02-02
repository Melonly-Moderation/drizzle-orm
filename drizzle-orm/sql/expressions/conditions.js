import { Column } from '~/column.ts';
import { is } from '~/entity.ts';
import { Table } from '~/table.ts';
import { isDriverValueEncoder, isSQLWrapper, Param, Placeholder, SQL, sql, StringChunk, View, } from '../sql.ts';
export function bindIfParam(value, column) {
    if (isDriverValueEncoder(column)
        && !isSQLWrapper(value)
        && !is(value, Param)
        && !is(value, Placeholder)
        && !is(value, Column)
        && !is(value, Table)
        && !is(value, View)) {
        return new Param(value, column);
    }
    return value;
}
/**
 * Test that two values are equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is null, you may want to use
 * `isNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford
 * db.select().from(cars)
 *   .where(eq(cars.make, 'Ford'))
 * ```
 *
 * @see isNull for a way to test equality to NULL.
 */
export const eq = (left, right) => {
    return sql `${left} = ${bindIfParam(right, left)}`;
};
/**
 * Test that two values are not equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is not null, you may want to use
 * `isNotNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars not made by Ford
 * db.select().from(cars)
 *   .where(ne(cars.make, 'Ford'))
 * ```
 *
 * @see isNotNull for a way to test whether a value is not null.
 */
export const ne = (left, right) => {
    return sql `${left} <> ${bindIfParam(right, left)}`;
};
export function and(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
        return undefined;
    }
    if (conditions.length === 1) {
        return new SQL(conditions);
    }
    return new SQL([
        new StringChunk('('),
        sql.join(conditions, new StringChunk(' and ')),
        new StringChunk(')'),
    ]);
}
export function or(...unfilteredConditions) {
    const conditions = unfilteredConditions.filter((c) => c !== undefined);
    if (conditions.length === 0) {
        return undefined;
    }
    if (conditions.length === 1) {
        return new SQL(conditions);
    }
    return new SQL([
        new StringChunk('('),
        sql.join(conditions, new StringChunk(' or ')),
        new StringChunk(')'),
    ]);
}
/**
 * Negate the meaning of an expression using the `not` keyword.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars _not_ made by GM or Ford.
 * db.select().from(cars)
 *   .where(not(inArray(cars.make, ['GM', 'Ford'])))
 * ```
 */
export function not(condition) {
    return sql `not ${condition}`;
}
/**
 * Test that the first expression passed is greater than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made after 2000.
 * db.select().from(cars)
 *   .where(gt(cars.year, 2000))
 * ```
 *
 * @see gte for greater-than-or-equal
 */
export const gt = (left, right) => {
    return sql `${left} > ${bindIfParam(right, left)}`;
};
/**
 * Test that the first expression passed is greater than
 * or equal to the second expression. Use `gt` to
 * test whether an expression is strictly greater
 * than another.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made on or after 2000.
 * db.select().from(cars)
 *   .where(gte(cars.year, 2000))
 * ```
 *
 * @see gt for a strictly greater-than condition
 */
export const gte = (left, right) => {
    return sql `${left} >= ${bindIfParam(right, left)}`;
};
/**
 * Test that the first expression passed is less than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lt(cars.year, 2000))
 * ```
 *
 * @see lte for less-than-or-equal
 */
export const lt = (left, right) => {
    return sql `${left} < ${bindIfParam(right, left)}`;
};
/**
 * Test that the first expression passed is less than
 * or equal to the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lte(cars.year, 2000))
 * ```
 *
 * @see lt for a strictly less-than condition
 */
export const lte = (left, right) => {
    return sql `${left} <= ${bindIfParam(right, left)}`;
};
export function inArray(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            return sql `false`;
        }
        return sql `${column} in ${values.map((v) => bindIfParam(v, column))}`;
    }
    return sql `${column} in ${bindIfParam(values, column)}`;
}
export function notInArray(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            return sql `true`;
        }
        return sql `${column} not in ${values.map((v) => bindIfParam(v, column))}`;
    }
    return sql `${column} not in ${bindIfParam(values, column)}`;
}
/**
 * Test whether an expression is NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have no discontinuedAt date.
 * db.select().from(cars)
 *   .where(isNull(cars.discontinuedAt))
 * ```
 *
 * @see isNotNull for the inverse of this test
 */
export function isNull(value) {
    return sql `${value} is null`;
}
/**
 * Test whether an expression is not NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have been discontinued.
 * db.select().from(cars)
 *   .where(isNotNull(cars.discontinuedAt))
 * ```
 *
 * @see isNull for the inverse of this test
 */
export function isNotNull(value) {
    return sql `${value} is not null`;
}
/**
 * Test whether a subquery evaluates to have any rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column has a match in a cities
 * // table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     exists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see notExists for the inverse of this test
 */
export function exists(subquery) {
    return sql `exists ${subquery}`;
}
/**
 * Test whether a subquery doesn't include any result
 * rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column doesn't match
 * // a row in the cities table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     notExists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see exists for the inverse of this test
 */
export function notExists(subquery) {
    return sql `not exists ${subquery}`;
}
export function between(column, min, max) {
    return sql `${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
export function notBetween(column, min, max) {
    return sql `${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
/**
 * Compare a column to a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(like(cars.name, '%Turbo%'))
 * ```
 *
 * @see ilike for a case-insensitive version of this condition
 */
export function like(column, value) {
    return sql `${column} like ${value}`;
}
/**
 * The inverse of like - this tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "ROver" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see like for the inverse condition
 * @see notIlike for a case-insensitive version of this condition
 */
export function notLike(column, value) {
    return sql `${column} not like ${value}`;
}
/**
 * Case-insensitively compare a column to a pattern,
 * which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * Unlike like, this performs a case-insensitive comparison.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(ilike(cars.name, '%Turbo%'))
 * ```
 *
 * @see like for a case-sensitive version of this condition
 */
export function ilike(column, value) {
    return sql `${column} ilike ${value}`;
}
/**
 * The inverse of ilike - this case-insensitively tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "Rover" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see ilike for the inverse condition
 * @see notLike for a case-sensitive version of this condition
 */
export function notIlike(column, value) {
    return sql `${column} not ilike ${value}`;
}
export function arrayContains(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error('arrayContains requires at least one value');
        }
        const array = sql `${bindIfParam(values, column)}`;
        return sql `${column} @> ${array}`;
    }
    return sql `${column} @> ${bindIfParam(values, column)}`;
}
export function arrayContained(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error('arrayContained requires at least one value');
        }
        const array = sql `${bindIfParam(values, column)}`;
        return sql `${column} <@ ${array}`;
    }
    return sql `${column} <@ ${bindIfParam(values, column)}`;
}
export function arrayOverlaps(column, values) {
    if (Array.isArray(values)) {
        if (values.length === 0) {
            throw new Error('arrayOverlaps requires at least one value');
        }
        const array = sql `${bindIfParam(values, column)}`;
        return sql `${column} && ${array}`;
    }
    return sql `${column} && ${bindIfParam(values, column)}`;
}
//# sourceMappingURL=conditions.js.map