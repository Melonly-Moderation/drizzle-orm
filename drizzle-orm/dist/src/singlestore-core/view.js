import { entityKind } from '~/entity.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { getTableColumns } from '~/utils.ts';
import { QueryBuilder } from './query-builders/query-builder.ts';
import { singlestoreTable } from './table.ts';
import { SingleStoreViewBase } from './view-base.ts';
import { SingleStoreViewConfig } from './view-common.ts';
export class ViewBuilderCore {
    name;
    schema;
    static [entityKind] = 'SingleStoreViewBuilder';
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
    }
    config = {};
    algorithm(algorithm) {
        this.config.algorithm = algorithm;
        return this;
    }
    definer(definer) {
        this.config.definer = definer;
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
    static [entityKind] = 'SingleStoreViewBuilder';
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
        return new Proxy(new SingleStoreView({
            singlestoreConfig: this.config,
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
    static [entityKind] = 'SingleStoreManualViewBuilder';
    columns;
    constructor(name, columns, schema) {
        super(name, schema);
        this.columns = getTableColumns(singlestoreTable(name, columns));
    }
    existing() {
        return new Proxy(new SingleStoreView({
            singlestoreConfig: undefined,
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
        return new Proxy(new SingleStoreView({
            singlestoreConfig: this.config,
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
export class SingleStoreView extends SingleStoreViewBase {
    static [entityKind] = 'SingleStoreView';
    [SingleStoreViewConfig];
    constructor({ singlestoreConfig, config }) {
        super(config);
        this[SingleStoreViewConfig] = singlestoreConfig;
    }
}
// TODO: needs to be implemented differently compared to MySQL.
// /** @internal */
// export function singlestoreViewWithSchema(
// 	name: string,
// 	selection: Record<string, SingleStoreColumnBuilderBase> | undefined,
// 	schema: string | undefined,
// ): ViewBuilder | ManualViewBuilder {
// 	if (selection) {
// 		return new ManualViewBuilder(name, selection, schema);
// 	}
// 	return new ViewBuilder(name, schema);
// }
// export function singlestoreView<TName extends string>(name: TName): ViewBuilder<TName>;
// export function singlestoreView<TName extends string, TColumns extends Record<string, SingleStoreColumnBuilderBase>>(
// 	name: TName,
// 	columns: TColumns,
// ): ManualViewBuilder<TName, TColumns>;
// export function singlestoreView(
// 	name: string,
// 	selection?: Record<string, SingleStoreColumnBuilderBase>,
// ): ViewBuilder | ManualViewBuilder {
// 	return singlestoreViewWithSchema(name, selection, undefined);
// }
//# sourceMappingURL=view.js.map