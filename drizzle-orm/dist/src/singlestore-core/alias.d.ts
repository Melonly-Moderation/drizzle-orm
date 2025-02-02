import type { BuildAliasTable } from './query-builders/select.types.ts';
import type { SingleStoreTable } from './table.ts';
export declare function alias<TTable extends SingleStoreTable, TAlias extends string>(// | SingleStoreViewBase
table: TTable, alias: TAlias): BuildAliasTable<TTable, TAlias>;
