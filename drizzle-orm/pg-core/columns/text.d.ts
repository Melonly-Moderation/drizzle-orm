import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Writable } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
type PgTextBuilderInitial<TName extends string, TEnum extends [string, ...string[]]> = PgTextBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgText';
    data: TEnum[number];
    enumValues: TEnum;
    driverParam: string;
}>;
export declare class PgTextBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgText'>> extends PgColumnBuilder<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config: PgTextConfig<T['enumValues']>);
}
export declare class PgText<T extends ColumnBaseConfig<'string', 'PgText'>> extends PgColumn<T, {
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    readonly enumValues: any;
    getSQLType(): string;
}
export interface PgTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
    enum?: TEnum;
}
export declare function text(): PgTextBuilderInitial<'', [string, ...string[]]>;
export declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: PgTextConfig<T | Writable<T>>): PgTextBuilderInitial<'', Writable<T>>;
export declare function text<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: PgTextConfig<T | Writable<T>>): PgTextBuilderInitial<TName, Writable<T>>;
export {};
