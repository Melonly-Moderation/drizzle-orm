import type { Placeholder, SQL, SQLWrapper } from '~/sql/sql.ts';
import type { MySqlColumn } from './columns/index.ts';
export * from '~/expressions.ts';
export declare function concat(column: MySqlColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: MySqlColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
