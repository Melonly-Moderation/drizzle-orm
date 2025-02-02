import type { PgColumn } from './columns/index.ts';
import type { PgTable } from './table.ts';
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: PgTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    static readonly [x: number]: string;
    private name?;
    constructor(columns: PgColumn[], name?: string | undefined);
    nullsNotDistinct(): this;
}
export declare class UniqueOnConstraintBuilder {
    static readonly [x: number]: string;
    constructor(name?: string);
    on(...columns: [PgColumn, ...PgColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    static readonly [x: number]: string;
    readonly table: PgTable;
    readonly columns: PgColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: PgTable, columns: PgColumn[], nullsNotDistinct: boolean, name?: string);
    getName(): string | undefined;
}
