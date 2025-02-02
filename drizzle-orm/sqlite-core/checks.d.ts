import type { SQL } from '~/sql/sql.ts';
import type { SQLiteTable } from './table.ts';
export declare class CheckBuilder {
    static readonly [x: number]: string;
    name: string;
    value: SQL;
    protected brand: 'SQLiteConstraintBuilder';
    constructor(name: string, value: SQL);
    build(table: SQLiteTable): Check;
}
export declare class Check {
    static readonly [x: number]: string;
    table: SQLiteTable;
    _: {
        brand: 'SQLiteCheck';
    };
    readonly name: string;
    readonly value: SQL;
    constructor(table: SQLiteTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
