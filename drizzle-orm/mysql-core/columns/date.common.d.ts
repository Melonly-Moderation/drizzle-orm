import type { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnDataType, HasDefault } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export interface MySqlDateColumnBaseConfig {
    hasOnUpdateNow: boolean;
}
export declare abstract class MySqlDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlDateColumnBaseConfig, TExtraConfig> {
    static readonly [x: number]: string;
    defaultNow(): any;
    onUpdateNow(): HasDefault<this>;
}
export declare abstract class MySqlDateBaseColumn<T extends ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlDateColumnBaseConfig & TRuntimeConfig> {
    static readonly [x: number]: string;
    readonly hasOnUpdateNow: boolean;
}
