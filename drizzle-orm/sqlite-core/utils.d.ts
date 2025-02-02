import type { Check } from './checks.ts';
import type { ForeignKey } from './foreign-keys.ts';
import type { Index } from './indexes.ts';
import type { PrimaryKey } from './primary-keys.ts';
import { SQLiteTable } from './table.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
import type { SQLiteView } from './view.ts';
export declare function getTableConfig<TTable extends SQLiteTable>(table: TTable): {
    columns: unknown[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: any;
};
export type OnConflict = 'rollback' | 'abort' | 'fail' | 'ignore' | 'replace';
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: SQLiteView<TName, TExisting>): any;
