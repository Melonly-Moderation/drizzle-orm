import type { BuildAliasTable } from './query-builders/select.types.ts';
import type { MySqlTable } from './table.ts';
import type { MySqlViewBase } from './view-base.ts';
export declare function alias<TTable extends MySqlTable | MySqlViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
