import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
import type { SingleStoreIntConfig } from './int.ts';
export type SingleStoreMediumIntBuilderInitial<TName extends string> = SingleStoreMediumIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreMediumInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreMediumIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreMediumInt'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config?: SingleStoreIntConfig);
}
export declare class SingleStoreMediumInt<T extends ColumnBaseConfig<'number', 'SingleStoreMediumInt'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreIntConfig> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function mediumint(): SingleStoreMediumIntBuilderInitial<''>;
export declare function mediumint(config?: SingleStoreIntConfig): SingleStoreMediumIntBuilderInitial<''>;
export declare function mediumint<TName extends string>(name: TName, config?: SingleStoreIntConfig): SingleStoreMediumIntBuilderInitial<TName>;
