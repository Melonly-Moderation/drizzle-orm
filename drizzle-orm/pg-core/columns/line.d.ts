import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { type Equal } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export type PgLineBuilderInitial<TName extends string> = PgLineBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgLine';
    data: [number, number, number];
    driverParam: number | string;
    enumValues: undefined;
}>;
export declare class PgLineBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgLine'>> extends PgColumnBuilder<T> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
}
export declare class PgLineTuple<T extends ColumnBaseConfig<'array', 'PgLine'>> extends PgColumn<T> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): [number, number, number];
    mapToDriverValue(value: [number, number, number]): string;
}
export type PgLineABCBuilderInitial<TName extends string> = PgLineABCBuilder<{
    name: TName;
    dataType: 'json';
    columnType: 'PgLineABC';
    data: {
        a: number;
        b: number;
        c: number;
    };
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgLineABCBuilder<T extends ColumnBuilderBaseConfig<'json', 'PgLineABC'>> extends PgColumnBuilder<T> {
    static readonly [x: number]: string;
    constructor(name: T['name']);
}
export declare class PgLineABC<T extends ColumnBaseConfig<'json', 'PgLineABC'>> extends PgColumn<T> {
    static readonly [x: number]: string;
    getSQLType(): string;
    mapFromDriverValue(value: string): {
        a: number;
        b: number;
        c: number;
    };
    mapToDriverValue(value: {
        a: number;
        b: number;
        c: number;
    }): string;
}
export interface PgLineTypeConfig<T extends 'tuple' | 'abc' = 'tuple' | 'abc'> {
    mode?: T;
}
export declare function line(): PgLineBuilderInitial<''>;
export declare function line<TMode extends PgLineTypeConfig['mode'] & {}>(config?: PgLineTypeConfig<TMode>): Equal<TMode, 'abc'> extends true ? PgLineABCBuilderInitial<''> : PgLineBuilderInitial<''>;
export declare function line<TName extends string, TMode extends PgLineTypeConfig['mode'] & {}>(name: TName, config?: PgLineTypeConfig<TMode>): Equal<TMode, 'abc'> extends true ? PgLineABCBuilderInitial<TName> : PgLineBuilderInitial<TName>;
