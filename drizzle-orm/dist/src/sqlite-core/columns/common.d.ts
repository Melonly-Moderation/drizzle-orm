import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasGenerated } from '~/column-builder.ts';
import { ColumnBuilder } from '~/column-builder.ts';
import { Column } from '~/column.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import type { SQL } from '~/sql/sql.ts';
import type { UpdateDeleteAction } from '~/sqlite-core/foreign-keys.ts';
import type { SQLiteTable } from '~/sqlite-core/table.ts';
import type { Update } from '~/utils.ts';
export interface ReferenceConfig {
    ref: () => SQLiteColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface SQLiteColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'sqlite';
}> {
}
export interface SQLiteGeneratedColumnConfig {
    mode?: 'virtual' | 'stored';
}
export declare abstract class SQLiteColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = object> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'sqlite';
}, TExtraConfig> implements SQLiteColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    private foreignKeyConfigs;
    references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
    unique(name?: string): this;
    generatedAlwaysAs(as: SQL | T['data'] | (() => SQL), config?: SQLiteGeneratedColumnConfig): HasGenerated<this, {
        type: 'always';
    }>;
}
export declare abstract class SQLiteColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = {}, TTypeConfig extends object = {}> extends Column<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'sqlite';
}> {
    readonly table: SQLiteTable;
    static readonly [entityKind]: string;
    constructor(table: SQLiteTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type AnySQLiteColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = SQLiteColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
