import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export type MySqlDecimalBuilderInitial<TName extends string> = MySqlDecimalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlDecimal';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlDecimalBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlDecimal'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config: MySqlDecimalConfig | undefined);
}
export declare class MySqlDecimal<T extends ColumnBaseConfig<'string', 'MySqlDecimal'>> extends MySqlColumnWithAutoIncrement<T, MySqlDecimalConfig> {
    static readonly [x: number]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface MySqlDecimalConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function decimal(): MySqlDecimalBuilderInitial<''>;
export declare function decimal(config: MySqlDecimalConfig): MySqlDecimalBuilderInitial<''>;
export declare function decimal<TName extends string>(name: TName, config?: MySqlDecimalConfig): MySqlDecimalBuilderInitial<TName>;
