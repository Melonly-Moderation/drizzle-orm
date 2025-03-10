import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
import type { MySqlIntConfig } from './int.ts';
export type MySqlSmallIntBuilderInitial<TName extends string> = MySqlSmallIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlSmallInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlSmallIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlSmallInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config?: MySqlIntConfig);
}
export declare class MySqlSmallInt<T extends ColumnBaseConfig<'number', 'MySqlSmallInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function smallint(): MySqlSmallIntBuilderInitial<''>;
export declare function smallint(config?: MySqlIntConfig): MySqlSmallIntBuilderInitial<''>;
export declare function smallint<TName extends string>(name: TName, config?: MySqlIntConfig): MySqlSmallIntBuilderInitial<TName>;
