import type { Check } from './checks.ts';
import type { ForeignKey } from './foreign-keys.ts';
import type { Index } from './indexes.ts';
import type { PrimaryKey } from './primary-keys.ts';
import type { IndexForHint } from './query-builders/select.ts';
import { MySqlTable } from './table.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
import type { MySqlView } from './view.ts';
export declare function getTableConfig(table: MySqlTable): {
    columns: unknown[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: any;
    schema: any;
    baseName: any;
};
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: MySqlView<TName, TExisting>): any;
export declare function convertIndexToString(indexes: IndexForHint[]): string[];
export declare function toArray<T>(value: T | T[]): T[];
