import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export type SQLiteNumericBuilderInitial<TName extends string> = SQLiteNumericBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SQLiteNumeric';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class SQLiteNumericBuilder<T extends ColumnBuilderBaseConfig<'string', 'SQLiteNumeric'>> extends SQLiteColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class SQLiteNumeric<T extends ColumnBaseConfig<'string', 'SQLiteNumeric'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function numeric(): SQLiteNumericBuilderInitial<''>;
export declare function numeric<TName extends string>(name: TName): SQLiteNumericBuilderInitial<TName>;
