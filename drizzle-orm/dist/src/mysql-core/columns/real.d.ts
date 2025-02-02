import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export type MySqlRealBuilderInitial<TName extends string> = MySqlRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlReal';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlReal'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlRealConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: MySqlRealConfig | undefined);
}
export declare class MySqlReal<T extends ColumnBaseConfig<'number', 'MySqlReal'>> extends MySqlColumnWithAutoIncrement<T, MySqlRealConfig> {
    static readonly [entityKind]: string;
    precision: number | undefined;
    scale: number | undefined;
    getSQLType(): string;
}
export interface MySqlRealConfig {
    precision?: number;
    scale?: number;
}
export declare function real(): MySqlRealBuilderInitial<''>;
export declare function real(config?: MySqlRealConfig): MySqlRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName, config?: MySqlRealConfig): MySqlRealBuilderInitial<TName>;
