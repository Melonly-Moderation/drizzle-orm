import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export type SQLiteRealBuilderInitial<TName extends string> = SQLiteRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SQLiteReal';
    data: number;
    driverParam: number;
    enumValues: undefined;
}>;
export declare class SQLiteRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'SQLiteReal'>> extends SQLiteColumnBuilder<T> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
}
export declare class SQLiteReal<T extends ColumnBaseConfig<'number', 'SQLiteReal'>> extends SQLiteColumn<T> {
    static readonly [x: number]: string;
    getSQLType(): string;
}
export declare function real(): SQLiteRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName): SQLiteRealBuilderInitial<TName>;
