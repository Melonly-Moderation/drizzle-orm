import { entityKind } from '~/entity.ts';
import type { SQL } from '~/sql/sql.ts';
import type { MySqlTable } from './table.ts';
export declare class CheckBuilder {
    name: string;
    value: SQL;
    static readonly [entityKind]: string;
    protected brand: 'MySqlConstraintBuilder';
    constructor(name: string, value: SQL);
}
export declare class Check {
    table: MySqlTable;
    static readonly [entityKind]: string;
    readonly name: string;
    readonly value: SQL;
    constructor(table: MySqlTable, builder: CheckBuilder);
}
export declare function check(name: string, value: SQL): CheckBuilder;
