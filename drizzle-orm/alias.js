import { Column } from './column.ts';
import { entityKind, is } from './entity.ts';
import { SQL, sql } from './sql/sql.ts';
import { Table } from './table.ts';
import { ViewBaseConfig } from './view-common.ts';
export class ColumnAliasProxyHandler {
    table;
    static [entityKind] = 'ColumnAliasProxyHandler';
    constructor(table) {
        this.table = table;
    }
    get(columnObj, prop) {
        if (prop === 'table') {
            return this.table;
        }
        return columnObj[prop];
    }
}
export class TableAliasProxyHandler {
    alias;
    replaceOriginalName;
    static [entityKind] = 'TableAliasProxyHandler';
    constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
    }
    get(target, prop) {
        if (prop === Table.Symbol.IsAlias) {
            return true;
        }
        if (prop === Table.Symbol.Name) {
            return this.alias;
        }
        if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
            return this.alias;
        }
        if (prop === ViewBaseConfig) {
            return {
                ...target[ViewBaseConfig],
                name: this.alias,
                isAlias: true,
            };
        }
        if (prop === Table.Symbol.Columns) {
            const columns = target[Table.Symbol.Columns];
            if (!columns) {
                return columns;
            }
            const proxiedColumns = {};
            Object.keys(columns).map((key) => {
                proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
            });
            return proxiedColumns;
        }
        const value = target[prop];
        if (is(value, Column)) {
            return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
        }
        return value;
    }
}
export class RelationTableAliasProxyHandler {
    alias;
    static [entityKind] = 'RelationTableAliasProxyHandler';
    constructor(alias) {
        this.alias = alias;
    }
    get(target, prop) {
        if (prop === 'sourceTable') {
            return aliasedTable(target.sourceTable, this.alias);
        }
        return target[prop];
    }
}
export function aliasedTable(table, tableAlias) {
    return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
export function aliasedRelation(relation, tableAlias) {
    return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
}
export function aliasedTableColumn(column, tableAlias) {
    return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
}
export function mapColumnsInAliasedSQLToAlias(query, alias) {
    return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
export function mapColumnsInSQLToAlias(query, alias) {
    return sql.join(query.queryChunks.map((c) => {
        if (is(c, Column)) {
            return aliasedTableColumn(c, alias);
        }
        if (is(c, SQL)) {
            return mapColumnsInSQLToAlias(c, alias);
        }
        if (is(c, SQL.Aliased)) {
            return mapColumnsInAliasedSQLToAlias(c, alias);
        }
        return c;
    }));
}
//# sourceMappingURL=alias.js.map