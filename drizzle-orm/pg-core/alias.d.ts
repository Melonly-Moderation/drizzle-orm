import type { BuildAliasTable } from './query-builders/select.types.ts';
import type { PgTable } from './table.ts';
import type { PgViewBase } from './view-base.ts';
export declare function alias<TTable extends PgTable | PgViewBase, TAlias extends string>(table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
