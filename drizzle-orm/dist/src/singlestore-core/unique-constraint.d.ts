import { entityKind } from '~/entity.ts';
import type { SingleStoreColumn } from './columns/index.ts';
import type { SingleStoreTable } from './table.ts';
export declare function unique(name?: string): UniqueOnConstraintBuilder;
export declare function uniqueKeyName(table: SingleStoreTable, columns: string[]): string;
export declare class UniqueConstraintBuilder {
    private name?;
    static readonly [entityKind]: string;
    constructor(columns: SingleStoreColumn[], name?: string | undefined);
}
export declare class UniqueOnConstraintBuilder {
    static readonly [entityKind]: string;
    constructor(name?: string);
    on(...columns: [SingleStoreColumn, ...SingleStoreColumn[]]): UniqueConstraintBuilder;
}
export declare class UniqueConstraint {
    readonly table: SingleStoreTable;
    static readonly [entityKind]: string;
    readonly columns: SingleStoreColumn[];
    readonly name?: string;
    readonly nullsNotDistinct: boolean;
    constructor(table: SingleStoreTable, columns: SingleStoreColumn[], name?: string);
    getName(): string | undefined;
}
