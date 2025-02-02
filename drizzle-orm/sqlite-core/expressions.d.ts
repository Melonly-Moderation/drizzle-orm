import type { SQL, SQLWrapper } from '~/sql/sql.ts';
import type { SQLiteColumn } from '~/sqlite-core/columns/index.ts';
export * from '~/expressions.ts';
export declare function concat(column: SQLiteColumn | SQL.Aliased, value: string | SQLWrapper): SQL;
export declare function substring(column: SQLiteColumn | SQL.Aliased, { from, for: _for }: {
    from?: number | SQLWrapper;
    for?: number | SQLWrapper;
}): SQL;
export declare function rowId(): SQL<number>;
