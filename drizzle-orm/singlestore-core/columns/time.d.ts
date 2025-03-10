import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export type SingleStoreTimeBuilderInitial<TName extends string> = SingleStoreTimeBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreTime';
    data: string;
    driverParam: string | number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreTimeBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreTime'>> extends SingleStoreColumnBuilder<T> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreTime<T extends ColumnBaseConfig<'string', 'SingleStoreTime'>> extends SingleStoreColumn<T> {
    static readonly [x: number]: string;
    getSQLType(): string;
}
export declare function time(): SingleStoreTimeBuilderInitial<''>;
export declare function time<TName extends string>(name: TName): SingleStoreTimeBuilderInitial<TName>;
