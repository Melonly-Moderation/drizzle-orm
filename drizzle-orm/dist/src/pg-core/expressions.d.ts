import type { PgColumn } from '~/pg-core/columns/index.ts';
import type { Placeholder, SQL, SQLWrapper } from '~/sql/sql.ts';
export * from '~/expressions.ts';
export declare function concat(column: PgColumn | SQL.Aliased, value: string | Placeholder | SQLWrapper): SQL;
export declare function substring(column: PgColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | Placeholder | SQLWrapper;
    for?: number | Placeholder | SQLWrapper;
}): SQL;
