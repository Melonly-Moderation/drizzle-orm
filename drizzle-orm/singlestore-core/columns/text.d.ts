import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Writable } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export type SingleStoreTextColumnType = 'tinytext' | 'text' | 'mediumtext' | 'longtext';
export type SingleStoreTextBuilderInitial<TName extends string, TEnum extends [string, ...string[]]> = SingleStoreTextBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreText';
    data: TEnum[number];
    driverParam: string;
    enumValues: TEnum;
    generated: undefined;
}>;
export declare class SingleStoreTextBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreText'>> extends SingleStoreColumnBuilder<T, {
    textType: SingleStoreTextColumnType;
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    constructor(name: T['name'], textType: SingleStoreTextColumnType, config: SingleStoreTextConfig<T['enumValues']>);
}
export declare class SingleStoreText<T extends ColumnBaseConfig<'string', 'SingleStoreText'>> extends SingleStoreColumn<T, {
    textType: SingleStoreTextColumnType;
    enumValues: T['enumValues'];
}> {
    static readonly [x: number]: string;
    readonly textType: SingleStoreTextColumnType;
    readonly enumValues: any;
    getSQLType(): string;
}
export interface SingleStoreTextConfig<TEnum extends readonly string[] | string[] | undefined = readonly string[] | string[] | undefined> {
    enum?: TEnum;
}
export declare function text(): SingleStoreTextBuilderInitial<'', [string, ...string[]]>;
export declare function text<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<'', Writable<T>>;
export declare function text<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<TName, Writable<T>>;
export declare function tinytext(): SingleStoreTextBuilderInitial<'', [string, ...string[]]>;
export declare function tinytext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<'', Writable<T>>;
export declare function tinytext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<TName, Writable<T>>;
export declare function mediumtext(): SingleStoreTextBuilderInitial<'', [string, ...string[]]>;
export declare function mediumtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<'', Writable<T>>;
export declare function mediumtext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<TName, Writable<T>>;
export declare function longtext(): SingleStoreTextBuilderInitial<'', [string, ...string[]]>;
export declare function longtext<U extends string, T extends Readonly<[U, ...U[]]>>(config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<'', Writable<T>>;
export declare function longtext<TName extends string, U extends string, T extends Readonly<[U, ...U[]]>>(name: TName, config?: SingleStoreTextConfig<T | Writable<T>>): SingleStoreTextBuilderInitial<TName, Writable<T>>;
