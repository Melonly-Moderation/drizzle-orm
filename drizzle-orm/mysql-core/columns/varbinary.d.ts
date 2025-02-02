import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export type MySqlVarBinaryBuilderInitial<TName extends string> = MySqlVarBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlVarBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlVarBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlVarBinary'>> extends MySqlColumnBuilder<T, MySqlVarbinaryOptions> {
    static readonly [x: number]: string;
}
export declare class MySqlVarBinary<T extends ColumnBaseConfig<'string', 'MySqlVarBinary'>> extends MySqlColumn<T, MySqlVarbinaryOptions> {
    static readonly [x: number]: string;
    length: number | undefined;
    getSQLType(): string;
}
export interface MySqlVarbinaryOptions {
    length: number;
}
export declare function varbinary(config: MySqlVarbinaryOptions): MySqlVarBinaryBuilderInitial<''>;
export declare function varbinary<TName extends string>(name: TName, config: MySqlVarbinaryOptions): MySqlVarBinaryBuilderInitial<TName>;
