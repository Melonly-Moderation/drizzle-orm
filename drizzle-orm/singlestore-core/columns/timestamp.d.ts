import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Equal } from '~/utils.ts';
import { SingleStoreDateBaseColumn, SingleStoreDateColumnBaseBuilder } from './date.common.ts';
export type SingleStoreTimestampBuilderInitial<TName extends string> = SingleStoreTimestampBuilder<{
    name: TName;
    dataType: 'date';
    columnType: 'SingleStoreTimestamp';
    data: Date;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreTimestampBuilder<T extends ColumnBuilderBaseConfig<'date', 'SingleStoreTimestamp'>> extends SingleStoreDateColumnBaseBuilder<T, SingleStoreTimestampConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
    defaultNow(): any;
}
export declare class SingleStoreTimestamp<T extends ColumnBaseConfig<'date', 'SingleStoreTimestamp'>> extends SingleStoreDateBaseColumn<T, SingleStoreTimestampConfig> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): Date;
    mapToDriverValue(value: Date): string;
}
export type SingleStoreTimestampStringBuilderInitial<TName extends string> = SingleStoreTimestampStringBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreTimestampString';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreTimestampStringBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreTimestampString'>> extends SingleStoreDateColumnBaseBuilder<T, SingleStoreTimestampConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
    defaultNow(): any;
}
export declare class SingleStoreTimestampString<T extends ColumnBaseConfig<'string', 'SingleStoreTimestampString'>> extends SingleStoreDateBaseColumn<T, SingleStoreTimestampConfig> {
    static readonly [x: number]: string;
    getSQLType(): string;
}
export interface SingleStoreTimestampConfig<TMode extends 'string' | 'date' = 'string' | 'date'> {
    mode?: TMode;
}
export declare function timestamp(): SingleStoreTimestampBuilderInitial<''>;
export declare function timestamp<TMode extends SingleStoreTimestampConfig['mode'] & {}>(config?: SingleStoreTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreTimestampStringBuilderInitial<''> : SingleStoreTimestampBuilderInitial<''>;
export declare function timestamp<TName extends string, TMode extends SingleStoreTimestampConfig['mode'] & {}>(name: TName, config?: SingleStoreTimestampConfig<TMode>): Equal<TMode, 'string'> extends true ? SingleStoreTimestampStringBuilderInitial<TName> : SingleStoreTimestampBuilderInitial<TName>;
