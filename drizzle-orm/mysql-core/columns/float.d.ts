import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export type MySqlFloatBuilderInitial<TName extends string> = MySqlFloatBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'MySqlFloat';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class MySqlFloatBuilder<T extends ColumnBuilderBaseConfig<'number', 'MySqlFloat'>> extends MySqlColumnBuilderWithAutoIncrement<T, MySqlFloatConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config: MySqlFloatConfig | undefined);
}
export declare class MySqlFloat<T extends ColumnBaseConfig<'number', 'MySqlFloat'>> extends MySqlColumnWithAutoIncrement<T, MySqlFloatConfig> {
    static readonly [x: number]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface MySqlFloatConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function float(): MySqlFloatBuilderInitial<''>;
export declare function float(config?: MySqlFloatConfig): MySqlFloatBuilderInitial<''>;
export declare function float<TName extends string>(name: TName, config?: MySqlFloatConfig): MySqlFloatBuilderInitial<TName>;
