import { ColumnAliasProxyHandler, TableAliasProxyHandler } from './alias.ts';
import { Column } from './column.ts';
import { entityKind, is } from './entity.ts';
import { SQL, View } from './sql/sql.ts';
import { Subquery } from './subquery.ts';
import { ViewBaseConfig } from './view-common.ts';
export class SelectionProxyHandler {
    static [entityKind] = 'SelectionProxyHandler';
    config;
    constructor(config) {
        this.config = { ...config };
    }
    get(subquery, prop) {
        if (prop === '_') {
            return {
                ...subquery['_'],
                selectedFields: new Proxy(subquery._.selectedFields, this),
            };
        }
        if (prop === ViewBaseConfig) {
            return {
                ...subquery[ViewBaseConfig],
                selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this),
            };
        }
        if (typeof prop === 'symbol') {
            return subquery[prop];
        }
        const columns = is(subquery, Subquery)
            ? subquery._.selectedFields
            : is(subquery, View)
                ? subquery[ViewBaseConfig].selectedFields
                : subquery;
        const value = columns[prop];
        if (is(value, SQL.Aliased)) {
            // Never return the underlying SQL expression for a field previously selected in a subquery
            if (this.config.sqlAliasedBehavior === 'sql' && !value.isSelectionField) {
                return value.sql;
            }
            const newValue = value.clone();
            newValue.isSelectionField = true;
            return newValue;
        }
        if (is(value, SQL)) {
            if (this.config.sqlBehavior === 'sql') {
                return value;
            }
            throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
        }
        if (is(value, Column)) {
            if (this.config.alias) {
                return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
            }
            return value;
        }
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        return new Proxy(value, new SelectionProxyHandler(this.config));
    }
}
//# sourceMappingURL=selection-proxy.js.map