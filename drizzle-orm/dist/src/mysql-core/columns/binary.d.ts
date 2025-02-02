import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export type MySqlBinaryBuilderInitial<TName extends string> = MySqlBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'MySqlBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class MySqlBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'MySqlBinary'>> extends MySqlColumnBuilder<T, MySqlBinaryConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], length: number | undefined);
}
export declare class MySqlBinary<T extends ColumnBaseConfig<'string', 'MySqlBinary'>> extends MySqlColumn<T, MySqlBinaryConfig> {
    static readonly [entityKind]: string;
    length: number | undefined;
    getSQLType(): string;
}
export interface MySqlBinaryConfig {
    length?: number;
}
export declare function binary(): MySqlBinaryBuilderInitial<''>;
export declare function binary(config?: MySqlBinaryConfig): MySqlBinaryBuilderInitial<''>;
export declare function binary<TName extends string>(name: TName, config?: MySqlBinaryConfig): MySqlBinaryBuilderInitial<TName>;
