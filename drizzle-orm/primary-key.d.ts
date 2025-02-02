import type { AnyColumn } from './column.ts';
import type { Table } from './table.ts';
export declare abstract class PrimaryKey {
    static readonly [x: number]: string;
    readonly table: Table;
    readonly columns: AnyColumn[];
    protected $brand: 'PrimaryKey';
    constructor(table: Table, columns: AnyColumn[]);
}
