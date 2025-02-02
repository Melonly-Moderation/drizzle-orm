import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Writable } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export type PgCharBuilderInitial<TName extends string, TEnum extends [string, ...string[]], TLength extends number | undefined> = PgCharBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgChar';
    data: TEnum[number];
    enumValues: TEnum;
    driverParam: string;
    length: TLength;
}>;
export declare class PgCharBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgChar'> & {
    length?: number | undefined;
}> extends PgColumnBuilder<T, {
    length: T['length'];
    enumValues: T['enumValues'];
}, {
    length: T['length'];
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config: PgCharConfig<T['enumValues'], T['length']>);
}
export declare class PgChar<T extends ColumnBaseConfig<'string', 'PgChar'> & {
    length?: number | undefined;
}> extends PgColumn<T, {
    length: T['length'];
    enumValues: T['enumValues'];
}, {
    length: T['length'];
}> {
    static readonly [x: number]: string;
    readonly length: any;
    readonly enumValues: any;
    getSQLType(): string;
}
export interface PgCharConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined, TLength extends number | undefined = number | undefined> {
    enum?: TEnum;
    length?: TLength;
}
export declare function char(): PgCharBuilderInitial<'', [string, ...string[]], undefined>;
export declare function char<U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(config?: PgCharConfig<T | Writable<T>, L>): PgCharBuilderInitial<'', Writable<T>, L>;
export declare function char<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>, L extends number | undefined>(name: TName, config?: PgCharConfig<T | Writable<T>, L>): PgCharBuilderInitial<TName, Writable<T>, L>;
