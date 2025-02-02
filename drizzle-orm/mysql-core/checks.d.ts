import type { SQL } from '~/sql/sql.ts';
import type { MySqlTable } from './table.ts';
export declare class CheckBuilder {
    static readonly [x: number]: string;
    name: string;
    value: SQL;
    protected brand: 'MySqlConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    static readonly [x: number]: string;
    table: MySqlTable;
    readonly name: string;
    readonly value: SQL;
    constructor(table: MySqlTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
