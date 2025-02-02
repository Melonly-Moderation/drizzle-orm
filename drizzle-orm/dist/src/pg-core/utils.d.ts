import { PgTable } from '~/pg-core/table.ts';
import { type Check } from './checks.ts';
import type { AnyPgColumn } from './columns/index.ts';
import { type ForeignKey } from './foreign-keys.ts';
import type { Index } from './indexes.ts';
import { PgPolicy } from './policies.ts';
import { type PrimaryKey } from './primary-keys.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
import { type PgMaterializedView, type PgView } from './view.ts';
export declare function getTableConfig<TTable extends PgTable>(table: TTable): {
    columns: import("./index.ts").PgColumn<import("../column.ts").ColumnBaseConfig<import("../column-builder.ts").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    foreignKeys: ForeignKey[];
    checks: Check[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    policies: PgPolicy[];
    enableRLS: boolean;
};
export declare function getViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgView<TName, TExisting>): {
    with?: import("./view.ts").ViewWithConfig;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../index.ts").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : import("../index.ts").SQL<unknown>;
    isAlias: boolean;
};
export declare function getMaterializedViewConfig<TName extends string = string, TExisting extends boolean = boolean>(view: PgMaterializedView<TName, TExisting>): {
    with?: import("./view.ts").PgMaterializedViewWithConfig;
    using?: string;
    tablespace?: string;
    withNoData?: boolean;
    name: TName;
    originalName: TName;
    schema: string | undefined;
    selectedFields: import("../index.ts").ColumnsSelection;
    isExisting: TExisting;
    query: TExisting extends true ? undefined : import("../index.ts").SQL<unknown>;
    isAlias: boolean;
};
export type ColumnsWithTable<TTableName extends string, TForeignTableName extends string, TColumns extends AnyPgColumn<{
    tableName: TTableName;
}>[]> = {
    [Key in keyof TColumns]: AnyPgColumn<{
        tableName: TForeignTableName;
    }>;
};
