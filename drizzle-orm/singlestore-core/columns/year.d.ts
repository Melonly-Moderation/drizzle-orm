import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export type SingleStoreYearBuilderInitial<TName extends string> = SingleStoreYearBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreYear';
    data: number;
    driverParam: number;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreYearBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreYear'>> extends SingleStoreColumnBuilder<T> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
}
export declare class SingleStoreYear<T extends ColumnBaseConfig<'number', 'SingleStoreYear'>> extends SingleStoreColumn<T> {
    static readonly [x: number]: string;
    getSQLType(): string;
}
export declare function year(): SingleStoreYearBuilderInitial<''>;
export declare function year<TName extends string>(name: TName): SingleStoreYearBuilderInitial<TName>;
