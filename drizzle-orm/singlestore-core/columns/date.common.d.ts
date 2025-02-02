import type { ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnDataType, HasDefault } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export interface SingleStoreDateColumnBaseConfig {
    hasOnUpdateNow: boolean;
}
export declare abstract class SingleStoreDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends SingleStoreColumnBuilder<T, TRuntimeConfig & SingleStoreDateColumnBaseConfig, TExtraConfig> {
    static readonly [x: number]: string;
    defaultNow(): any;
    onUpdateNow(): HasDefault<this>;
}
export declare abstract class SingleStoreDateBaseColumn<T extends ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends SingleStoreColumn<T, SingleStoreDateColumnBaseConfig & TRuntimeConfig> {
    static readonly [x: number]: string;
    readonly hasOnUpdateNow: boolean;
}
