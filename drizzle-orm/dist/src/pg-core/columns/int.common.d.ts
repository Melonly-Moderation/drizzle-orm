import type { ColumnBuilderBaseConfig, ColumnDataType, GeneratedIdentityConfig, IsIdentity } from '~/column-builder.ts';
import { entityKind } from '~/entity.ts';
import type { PgSequenceOptions } from '../sequence.ts';
import { PgColumnBuilder } from './common.ts';
export declare abstract class PgIntColumnBaseBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends PgColumnBuilder<T, {
    generatedIdentity: GeneratedIdentityConfig;
}> {
    static readonly [entityKind]: string;
    generatedAlwaysAsIdentity(sequence?: PgSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'always'>;
    generatedByDefaultAsIdentity(sequence?: PgSequenceOptions & {
        name?: string;
    }): IsIdentity<this, 'byDefault'>;
}
