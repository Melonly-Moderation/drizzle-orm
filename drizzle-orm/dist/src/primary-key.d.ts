import { entityKind } from '~/entity.ts';
import type { AnyColumn } from './column.ts';
import type { Table } from './table.ts';
export declare abstract class PrimaryKey {
    readonly table: Table;
    readonly columns: AnyColumn[];
    static readonly [entityKind]: string;
    protected $brand: 'PrimaryKey';
    constructor(table: Table, columns: AnyColumn[]);
}
