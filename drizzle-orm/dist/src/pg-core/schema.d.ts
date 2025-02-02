import { entityKind } from '~/entity.ts';
import { SQL, type SQLWrapper } from '~/sql/sql.ts';
import type { pgEnum } from './columns/enum.ts';
import { type pgSequence } from './sequence.ts';
import { type PgTableFn } from './table.ts';
import { type pgMaterializedView, type pgView } from './view.ts';
export declare class PgSchema<TName extends string = string> implements SQLWrapper {
    readonly schemaName: TName;
    static readonly [entityKind]: string;
    constructor(schemaName: TName);
    table: PgTableFn<TName>;
    view: typeof pgView;
    materializedView: typeof pgMaterializedView;
    enum: typeof pgEnum;
    sequence: typeof pgSequence;
    getSQL(): SQL;
    shouldOmitSQLParens(): boolean;
}
export declare function isPgSchema(obj: unknown): obj is PgSchema;
export declare function pgSchema<T extends string>(name: T): PgSchema<T>;
