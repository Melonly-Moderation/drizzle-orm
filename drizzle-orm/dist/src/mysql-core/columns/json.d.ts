import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export type MySqlJsonBuilderInitial<TName extends string> = MySqlJsonBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'MySqlJson';
    data: unknown;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlJsonBuilder<T extends ColumnBuilderBaseConfig<'json', 'MySqlJson'>> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class MySqlJson<T extends ColumnBaseConfig<'json', 'MySqlJson'>> extends MySqlColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapToDriverValue(value: T['data']): string;
}
export declare function json(): MySqlJsonBuilderInitial<''>;
export declare function json<TName extends string>(name: TName): MySqlJsonBuilderInitial<TName>;
