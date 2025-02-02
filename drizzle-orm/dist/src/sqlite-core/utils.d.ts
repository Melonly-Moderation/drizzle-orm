import type { Check } from './checks.ts';
import type { ForeignKey } from './foreign-keys.ts';
import type { Index } from './indexes.ts';
import type { PrimaryKey } from './primary-keys.ts';
import { SQLiteTable } from './table.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
import type { SQLiteView } from './view.ts';
export declare function getTableConfig<TTable extends SQLiteTable>(table: TTable): {
    columns: import("./index.ts").SQLiteColumn<any, {}, {}>[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
};
export type OnConflict = 'rollback' | 'abort' | 'fail' | 'ignore' | 'replace';
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: SQLiteView<TName, TExisting>): {
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../index.ts").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : import("../index.ts").SQL<unknown>;
    isAlias: boolean;
};
