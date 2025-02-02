import type { MySqlColumn } from './columns/index.ts';
import type { MySqlTable } from './table.ts';
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: MySqlTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    static readonly [x: number]: string;
    private name?;
    constructor(columns: MySqlColumn[], name?: string | undefined);
}
export declare class UniqueOnConstraintBuilder {
    static readonly [x: number]: string;
    constructor(name?: string);
    on(...columns: [MySqlColumn, ...MySqlColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    static readonly [x: number]: string;
    readonly table: MySqlTable;
    readonly columns: MySqlColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: MySqlTable, columns: MySqlColumn[], name?: string);
    getName(): string | undefined;
}
