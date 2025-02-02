import type { SQLiteColumn } from './columns/common.ts';
import type { SQLiteTable } from './table.ts';
export declare function uniqueKeyName(table: SQLiteTable, columns: string[]): string;
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare class UniqueConstraintBuilder {
    static readonly [x: number]: string;
    private name?;
    constructor(columns: SQLiteColumn[], name?: string | undefined);
}
export declare class UniqueOnConstraintBuilder {
    static readonly [x: number]: string;
    constructor(name?: string);
    on(...columns: [SQLiteColumn, ...SQLiteColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    static readonly [x: number]: string;
    readonly table: SQLiteTable;
    readonly columns: SQLiteColumn[];
    readonly name?: string;
    constructor(table: SQLiteTable, columns: SQLiteColumn[], name?: string);
    getName(): string | undefined;
}
