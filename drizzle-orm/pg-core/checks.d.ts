import type { SQL } from '~/sql/index.ts';
import type { PgTable } from './table.ts';
export declare class CheckBuilder {
    static readonly [x: number]: string;
    name: string;
    value: SQL;
    protected brand: 'PgConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    static readonly [x: number]: string;
    table: PgTable;
    readonly name: string;
    readonly value: SQL;
    constructor(table: PgTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
