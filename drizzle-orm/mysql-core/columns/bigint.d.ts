import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export type MySqlBigInt53BuilderInitial<TName extends string> = MySqlBigInt53Builder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlBigInt53';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlBigInt53Builder<T extends ColumnBuilderBaseConfig<'number', 'MySqlBigInt53'>> extends MySqlColumnBuilderWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], unsigned?: boolean);
}
export declare class MySqlBigInt53<T extends ColumnBaseConfig<'number', 'MySqlBigInt53'>> extends MySqlColumnWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export type MySqlBigInt64BuilderInitial<TName extends string> = MySqlBigInt64Builder<{
    name: TName;
    dataType: 'bigint';
    columnType: 'MySqlBigInt64';
    data: bigint;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlBigInt64Builder<T extends ColumnBuilderBaseConfig<'bigint', 'MySqlBigInt64'>> extends MySqlColumnBuilderWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], unsigned?: boolean);
}
export declare class MySqlBigInt64<T extends ColumnBaseConfig<'bigint', 'MySqlBigInt64'>> extends MySqlColumnWithAutoIncrement<T, {
    unsigned: boolean;
}> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): bigint;
}
export interface MySqlBigIntConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
    mode: T;
    unsigned?: boolean;
}
export declare function bigint<TMode extends MySqlBigIntConfig['mode']>(config: MySqlBigIntConfig<TMode>): TMode extends 'number' ? MySqlBigInt53BuilderInitial<''> : MySqlBigInt64BuilderInitial<''>;
export declare function bigint<TName extends string, TMode extends MySqlBigIntConfig['mode']>(name: TName, config: MySqlBigIntConfig<TMode>): TMode extends 'number' ? MySqlBigInt53BuilderInitial<TName> : MySqlBigInt64BuilderInitial<TName>;
