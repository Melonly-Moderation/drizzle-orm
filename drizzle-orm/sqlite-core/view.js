import { entityKind } from '~/entity.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { getTableColumns } from '~/utils.ts';
import { QueryBuilder } from './query-builders/query-builder.ts';
import { sqliteTable } from './table.ts';
import { SQLiteViewBase } from './view-base.ts';
export class ViewBuilderCore {
    name;
    static [entityKind] = 'SQLiteViewBuilderCore';
    constructor(name) {
        this.name = name;
    }
    config = {};
}
export class ViewBuilder extends ViewBuilderCore {
    static [entityKind] = 'SQLiteViewBuilder';
    as(qb) {
        if (typeof qb === 'function') {
            qb = qb(new QueryBuilder());
        }
        const selectionProxy = new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: 'error',
            sqlAliasedBehavior: 'alias',
            replaceOriginalName: true,
        });
        // const aliasedSelectedFields = new Proxy(qb.getSelectedFields(), selectionProxy);
        const aliasedSelectedFields = qb.getSelectedFields();
        return new Proxy(new SQLiteView({
            // sqliteConfig: this.config,
            config: {
                name: this.name,
                schema: undefined,
                selectedFields: aliasedSelectedFields,
                query: qb.getSQL().inlineParams(),
            },
        }), selectionProxy);
    }
}
export class ManualViewBuilder extends ViewBuilderCore {
    static [entityKind] = 'SQLiteManualViewBuilder';
    columns;
    constructor(name, columns) {
        super(name);
        this.columns = getTableColumns(sqliteTable(name, columns));
    }
    existing() {
        return new Proxy(new SQLiteView({
            config: {
                name: this.name,
                schema: undefined,
                selectedFields: this.columns,
                query: undefined,
            },
        }), new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: 'error',
            sqlAliasedBehavior: 'alias',
            replaceOriginalName: true,
        }));
    }
    as(query) {
        return new Proxy(new SQLiteView({
            config: {
                name: this.name,
                schema: undefined,
                selectedFields: this.columns,
                query: query.inlineParams(),
            },
        }), new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: 'error',
            sqlAliasedBehavior: 'alias',
            replaceOriginalName: true,
        }));
    }
}
export class SQLiteView extends SQLiteViewBase {
    static [entityKind] = 'SQLiteView';
    constructor({ config }) {
        super(config);
    }
}
export function sqliteView(name, selection) {
    if (selection) {
        return new ManualViewBuilder(name, selection);
    }
    return new ViewBuilder(name);
}
export const view = sqliteView;
//# sourceMappingURL=view.js.map