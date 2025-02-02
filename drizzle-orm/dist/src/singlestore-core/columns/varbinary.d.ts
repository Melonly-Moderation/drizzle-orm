import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export type SingleStoreVarBinaryBuilderInitial<TName extends string> = SingleStoreVarBinaryBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreVarBinary';
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreVarBinaryBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreVarBinary'>> extends SingleStoreColumnBuilder<T, SingleStoreVarbinaryOptions> {
    static readonly [entityKind]: string;
}
export declare class SingleStoreVarBinary<T extends ColumnBaseConfig<'string', 'SingleStoreVarBinary'>> extends SingleStoreColumn<T, SingleStoreVarbinaryOptions> {
    static readonly [entityKind]: string;
    length: number | undefined;
    getSQLType(): string;
}
export interface SingleStoreVarbinaryOptions {
    length: number;
}
export declare function varbinary(config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilderInitial<''>;
export declare function varbinary<TName extends string>(name: TName, config: SingleStoreVarbinaryOptions): SingleStoreVarBinaryBuilderInitial<TName>;
