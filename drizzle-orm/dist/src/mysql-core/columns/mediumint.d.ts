import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
import type { MySqlIntConfig } from './int.ts';
export type MySqlMediumIntBuilderInitial<TName extends string> = MySqlMediumIntBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlMediumInt';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlMediumIntBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlMediumInt'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config?: MySqlIntConfig);
}
export declare class MySqlMediumInt<T extends ColumnBaseConfig<'number', 'MySqlMediumInt'>> extends MySqlColumnWithAutoIncrement<T, MySqlIntConfig> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function mediumint(): MySqlMediumIntBuilderInitial<''>;
export declare function mediumint(config?: MySqlIntConfig): MySqlMediumIntBuilderInitial<''>;
export declare function mediumint<TName extends string>(name: TName, config?: MySqlIntConfig): MySqlMediumIntBuilderInitial<TName>;
