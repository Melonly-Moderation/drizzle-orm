import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { PgColumn } from './common.ts';
import { PgIntColumnBaseBuilder } from './int.common.ts';
export type PgIntegerBuilderInitial<TName extends string> = PgIntegerBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgInteger';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgIntegerBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgInteger'>> extends PgIntColumnBaseBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgInteger<T extends ColumnBaseConfig<'number', 'PgInteger'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
    mapFromDriverValue(value: number | string): number;
}
export declare function integer(): PgIntegerBuilderInitial<''>;
export declare function integer<TName extends string>(name: TName): PgIntegerBuilderInitial<TName>;
