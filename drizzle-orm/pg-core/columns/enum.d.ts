import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import type { AnyPgTable } from '~/pg-core/table.ts';
import type { Writable } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export type PgEnumColumnBuilderInitial<TName extends string, TValues extends [string, ...string[]]> = PgEnumColumnBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgEnumColumn';
    data: TValues[number];
    enumValues: TValues;
    driverParam: string;
}>;
export interface PgEnum<TValues extends [string, ...string[]]> {
    (): PgEnumColumnBuilderInitial<'', TValues>;
    <TName extends string>(name: TName): PgEnumColumnBuilderInitial<TName, TValues>;
    <TName extends string>(name?: TName): PgEnumColumnBuilderInitial<TName, TValues>;
    readonly enumName: string;
    readonly enumValues: TValues;
    readonly schema: string | undefined;
}
export declare function isPgEnum(obj: unknown): obj is PgEnum<[string, ...string[]]>;
export declare class PgEnumColumnBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgEnumColumn'> & {
    enumValues: [string, ...string[]];
}> extends PgColumnBuilder<T, {
    enum: PgEnum<T['enumValues']>;
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], enumInstance: PgEnum<T['enumValues']>);
}
export declare class PgEnumColumn<T extends ColumnBaseConfig<'string', 'PgEnumColumn'> & {
    enumValues: [string, ...string[]];
}> extends PgColumn<T, {
    enum: PgEnum<T['enumValues']>;
}> {
    static readonly [x: number]: string;
    readonly enum: any;
    readonly enumValues: any;
    constructor(table: AnyPgTable<{
        name: T['tableName'];
    }>, config: PgEnumColumnBuilder<T>['config']);
    getSQLType(): string;
}
export declare function pgEnum<U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>;
