import { Column } from '~/column.ts';
import { is } from '~/entity.ts';
import { sql } from '../sql.ts';
/**
 * Returns the number of values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Number employees with null values
 * db.select({ value: count() }).from(employees)
 * // Number of employees where `name` is not null
 * db.select({ value: count(employees.name) }).from(employees)
 * ```
 *
 * @see countDistinct to get the number of non-duplicate values in `expression`
 */
export function count(expression) {
    return sql `count(${expression || sql.raw('*')})`.mapWith(Number);
}
/**
 * Returns the number of non-duplicate values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Number of employees where `name` is distinct
 * db.select({ value: countDistinct(employees.name) }).from(employees)
 * ```
 *
 * @see count to get the number of values in `expression`, including duplicates
 */
export function countDistinct(expression) {
    return sql `count(distinct ${expression})`.mapWith(Number);
}
/**
 * Returns the average (arithmetic mean) of all non-null values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Average salary of an employee
 * db.select({ value: avg(employees.salary) }).from(employees)
 * ```
 *
 * @see avgDistinct to get the average of all non-null and non-duplicate values in `expression`
 */
export function avg(expression) {
    return sql `avg(${expression})`.mapWith(String);
}
/**
 * Returns the average (arithmetic mean) of all non-null and non-duplicate values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Average salary of an employee where `salary` is distinct
 * db.select({ value: avgDistinct(employees.salary) }).from(employees)
 * ```
 *
 * @see avg to get the average of all non-null values in `expression`, including duplicates
 */
export function avgDistinct(expression) {
    return sql `avg(distinct ${expression})`.mapWith(String);
}
/**
 * Returns the sum of all non-null values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Sum of every employee's salary
 * db.select({ value: sum(employees.salary) }).from(employees)
 * ```
 *
 * @see sumDistinct to get the sum of all non-null and non-duplicate values in `expression`
 */
export function sum(expression) {
    return sql `sum(${expression})`.mapWith(String);
}
/**
 * Returns the sum of all non-null and non-duplicate values in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // Sum of every employee's salary where `salary` is distinct (no duplicates)
 * db.select({ value: sumDistinct(employees.salary) }).from(employees)
 * ```
 *
 * @see sum to get the sum of all non-null values in `expression`, including duplicates
 */
export function sumDistinct(expression) {
    return sql `sum(distinct ${expression})`.mapWith(String);
}
/**
 * Returns the maximum value in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // The employee with the highest salary
 * db.select({ value: max(employees.salary) }).from(employees)
 * ```
 */
export function max(expression) {
    return sql `max(${expression})`.mapWith(is(expression, Column) ? expression : String);
}
/**
 * Returns the minimum value in `expression`.
 *
 * ## Examples
 *
 * ```ts
 * // The employee with the lowest salary
 * db.select({ value: min(employees.salary) }).from(employees)
 * ```
 */
export function min(expression) {
    return sql `min(${expression})`.mapWith(is(expression, Column) ? expression : String);
}
//# sourceMappingURL=aggregate.js.map