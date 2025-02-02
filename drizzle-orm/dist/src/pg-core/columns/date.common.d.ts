import type { ColumnBuilderBaseConfig, ColumnDataType } from '~/column-builder.ts';
import { entityKind } from '~/entity.ts';
import { PgColumnBuilder } from './common.ts';
export declare abstract class PgDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
    static readonly [entityKind]: string;
    defaultNow(): import("~/column-builder.ts").HasDefault<this>;
}
