import type { ColumnBuilderBaseConfig } from '~/column-builder.ts';
import type { ColumnBaseConfig } from '~/column.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export type SingleStoreFloatBuilderInitial<TName extends string> = SingleStoreFloatBuilder<{
    name: TName;
    dataType: 'number';
    columnType: 'SingleStoreFloat';
    data: number;
    driverParam: number | string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreFloatBuilder<T extends ColumnBuilderBaseConfig<'number', 'SingleStoreFloat'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreFloatConfig> {
    static readonly [x: number]: string;
    constructor(name: T['name'], config: SingleStoreFloatConfig | undefined);
}
export declare class SingleStoreFloat<T extends ColumnBaseConfig<'number', 'SingleStoreFloat'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreFloatConfig> {
    static readonly [x: number]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface SingleStoreFloatConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function float(): SingleStoreFloatBuilderInitial<''>;
export declare function float(config?: SingleStoreFloatConfig): SingleStoreFloatBuilderInitial<''>;
export declare function float<TName extends string>(name: TName, config?: SingleStoreFloatConfig): SingleStoreFloatBuilderInitial<TName>;
