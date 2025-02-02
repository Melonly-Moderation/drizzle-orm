import type { ColumnBuilderBaseConfig, ColumnDataType } from '~/column-builder.ts';
import { PgColumnBuilder } from './common.ts';
export declare abstract class PgDateColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends PgColumnBuilder<T, TRuntimeConfig> {
    static readonly [x: number]: string;
    defaultNow(): any;
}
