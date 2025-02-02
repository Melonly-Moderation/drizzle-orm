import type { BuildAliasTable } from './query-builders/select.types.ts';
import type { SQLiteTable } from './table.ts';
import type { SQLiteViewBase } from './view-base.ts';
export declare function alias<TTable extends SQLiteTable | SQLiteViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
