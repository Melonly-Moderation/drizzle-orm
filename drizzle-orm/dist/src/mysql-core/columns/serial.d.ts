import type { ColumnBuilderBaseConfig, HasDefault, IsAutoincrement, IsPrimaryKey, NotNull } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export type MySqlSerialBuilderInitial<TName extends string> = IsAutoincrement<IsPrimaryKey<NotNull<HasDefault<MySqlSerialBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlSerial';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>>>>>;
export declare class MySqlSerialBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlSerial'>> extends MySqlColumnBuilderWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlSerial<T extends ColumnBaseConfig<'number', 'MySqlSerial'>> extends MySqlColumnWithAutoIncrement<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function serial(): MySqlSerialBuilderInitial<''>;
export declare function serial<TName extends string>(name: TName): MySqlSerialBuilderInitial<TName>;
