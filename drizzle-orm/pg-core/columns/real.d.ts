import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import type { AnyPgTable } from '~/pg-core/table.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export type PgRealBuilderInitial<TName extends string> = PgRealBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'PgReal';
    data: number;
    driverParam: string | number;
    enumValues: undefined;
}>;
export declare class PgRealBuilder<T extends ColumnBuilderBaseConfig<'number', 'PgReal'>> extends PgColumnBuilder<T, {
    length: number | undefined;
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], length?: number);
}
export declare class PgReal<T extends ColumnBaseConfig<'number', 'PgReal'>> extends PgColumn<T> {
    static readonly [x: number]: string;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgRealBuilder<T>['config']);
    getSQLType(): string;
    mapFromDriverValue: (value: string | number) => number;
}
export declare function real(): PgRealBuilderInitial<''>;
export declare function real<TName extends string>(name: TName): PgRealBuilderInitial<TName>;
