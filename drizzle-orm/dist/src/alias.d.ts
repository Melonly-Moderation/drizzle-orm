import type { AnyColumn } from './column.ts';
import { Column } from './column.ts';
import { entityKind } from './entity.ts';
import type { Relation } from './relations.ts';
import type { View } from './sql/sql.ts';
import { SQL } from './sql/sql.ts';
import { Table } from './table.ts';
export declare class ColumnAliasProxyHandler<TColumn extends Column> implements ProxyHandler<TColumn> {
    private table;
    static readonly [entityKind]: string;
    constructor(table: Table | View);
    get(columnObj: TColumn, prop: string | symbol): any;
}
export declare class TableAliasProxyHandler<T extends Table | View> implements ProxyHandler<T> {
    private alias;
    private replaceOriginalName;
    static readonly [entityKind]: string;
    constructor(alias: string, replaceOriginalName: boolean);
    get(target: T, prop: string | symbol): any;
}
export declare class RelationTableAliasProxyHandler<T extends Relation> implements ProxyHandler<T> {
    private alias;
    static readonly [entityKind]: string;
    constructor(alias: string);
    get(target: T, prop: string | symbol): any;
}
export declare function aliasedTable<T extends Table | View>(table: T, tableAlias: string): T;
export declare function aliasedRelation<T extends Relation>(relation: T, tableAlias: string): T;
export declare function aliasedTableColumn<T extends AnyColumn>(column: T, tableAlias: string): T;
export declare function mapColumnsInAliasedSQLToAlias(query: SQL.Aliased, alias: string): SQL.Aliased;
export declare function mapColumnsInSQLToAlias(query: SQL, alias: string): SQL;
