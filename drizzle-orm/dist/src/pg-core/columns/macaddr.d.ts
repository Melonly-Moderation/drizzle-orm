import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export type PgMacaddrBuilderInitial<TName extends string> = PgMacaddrBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'PgMacaddr';
    data: string;
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgMacaddrBuilder<T extends ColumnBuilderBaseConfig<'string', 'PgMacaddr'>> extends PgColumnBuilder<T> {
    static readonly [entityKind]: string;
    constructor(name: T['name']);
}
export declare class PgMacaddr<T extends ColumnBaseConfig<'string', 'PgMacaddr'>> extends PgColumn<T> {
    static readonly [entityKind]: string;
    getSQLType(): string;
}
export declare function macaddr(): PgMacaddrBuilderInitial<''>;
export declare function macaddr<TName extends string>(name: TName): PgMacaddrBuilderInitial<TName>;
