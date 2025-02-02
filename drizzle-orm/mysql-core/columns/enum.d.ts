import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Writable } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export type MySqlEnumColumnBuilderInitial<TName extends string, TEnum extends [string, ...string[]]> = MySqlEnumColumnBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlEnumColumn';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
}>;
export declare class MySqlEnumColumnBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlEnumColumn'>> extends MySqlColumnBuilder<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], values: T['enumValues']);
}
export declare class MySqlEnumColumn<T extends ColumnBaseConfig<'string', 'MySqlEnumColumn'>> extends MySqlColumn<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    readonly enumValues: any;
    getSQLType(): string;
}
export declare function mysqlEnum<U extends string, T extends Readonly<[U, ...U[]]>>(values: T | Writable<T>): MySqlEnumColumnBuilderInitial<'', Writable<T>>;
export declare function mysqlEnum<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, values: T | Writable<T>): MySqlEnumColumnBuilderInitial<TName, Writable<T>>;
