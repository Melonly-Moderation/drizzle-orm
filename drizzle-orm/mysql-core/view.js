import { entityKind } from '~/entity.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { getTableColumns } from '~/utils.ts';
import { QueryBuilder } from './query-builders/query-builder.ts';
import { mysqlTable } from './table.ts';
import { MySqlViewBase } from './view-base.ts';
import { MySqlViewConfig } from './view-common.ts';
export class ViewBuilderCore {
    name;
    schema;
    static [entityKind] = 'MySqlViewBuilder';
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
    }
    config = {};
    algorithm(algorithm) {
        this.config.algorithm = algorithm;
        return this;
    }
    sqlSecurity(sqlSecurity) {
        this.config.sqlSecurity = sqlSecurity;
        return this;
    }
    withCheckOption(withCheckOption) {
        this.config.withCheckOption = withCheckOption ?? 'cascaded';
        return this;
    }
}
export class ViewBuilder extends ViewBuilderCore {
    static [entityKind] = 'MySqlViewBuilder';
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
        const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
        return new Proxy(new MySqlView({
            mysqlConfig: this.config,
            config: {
                name: this.name,
                schema: this.schema,
                selectedFields: aliasedSelection,
                query: qb.getSQL().inlineParams(),
            },
        }), selectionProxy);
    }
}
export class ManualViewBuilder extends ViewBuilderCore {
    static [entityKind] = 'MySqlManualViewBuilder';
    columns;
    constructor(name, columns, schema) {
        super(name, schema);
        this.columns = getTableColumns(mysqlTable(name, columns));
    }
    existing() {
        return new Proxy(new MySqlView({
            mysqlConfig: undefined,
            config: {
                name: this.name,
                schema: this.schema,
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
        return new Proxy(new MySqlView({
            mysqlConfig: this.config,
            config: {
                name: this.name,
                schema: this.schema,
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
export class MySqlView extends MySqlViewBase {
    static [entityKind] = 'MySqlView';
    [MySqlViewConfig];
    constructor({ mysqlConfig, config }) {
        super(config);
        this[MySqlViewConfig] = mysqlConfig;
    }
}
/** @internal */
export function mysqlViewWithSchema(name, selection, schema) {
    if (selection) {
        return new ManualViewBuilder(name, selection, schema);
    }
    return new ViewBuilder(name, schema);
}
export function mysqlView(name, selection) {
    return mysqlViewWithSchema(name, selection, undefined);
}
//# sourceMappingURL=view.js.map