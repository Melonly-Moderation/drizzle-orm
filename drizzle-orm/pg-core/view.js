import { entityKind, is } from '~/entity.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { getTableColumns } from '~/utils.ts';
import { QueryBuilder } from './query-builders/query-builder.ts';
import { pgTable } from './table.ts';
import { PgViewBase } from './view-base.ts';
import { PgViewConfig } from './view-common.ts';
export class DefaultViewBuilderCore {
    name;
    schema;
    static [entityKind] = 'PgDefaultViewBuilderCore';
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
    }
    config = {};
    with(config) {
        this.config.with = config;
        return this;
    }
}
export class ViewBuilder extends DefaultViewBuilderCore {
    static [entityKind] = 'PgViewBuilder';
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
        return new Proxy(new PgView({
            pgConfig: this.config,
            config: {
                name: this.name,
                schema: this.schema,
                selectedFields: aliasedSelection,
                query: qb.getSQL().inlineParams(),
            },
        }), selectionProxy);
    }
}
export class ManualViewBuilder extends DefaultViewBuilderCore {
    static [entityKind] = 'PgManualViewBuilder';
    columns;
    constructor(name, columns, schema) {
        super(name, schema);
        this.columns = getTableColumns(pgTable(name, columns));
    }
    existing() {
        return new Proxy(new PgView({
            pgConfig: undefined,
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
        return new Proxy(new PgView({
            pgConfig: this.config,
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
export class MaterializedViewBuilderCore {
    name;
    schema;
    static [entityKind] = 'PgMaterializedViewBuilderCore';
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
    }
    config = {};
    using(using) {
        this.config.using = using;
        return this;
    }
    with(config) {
        this.config.with = config;
        return this;
    }
    tablespace(tablespace) {
        this.config.tablespace = tablespace;
        return this;
    }
    withNoData() {
        this.config.withNoData = true;
        return this;
    }
}
export class MaterializedViewBuilder extends MaterializedViewBuilderCore {
    static [entityKind] = 'PgMaterializedViewBuilder';
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
        return new Proxy(new PgMaterializedView({
            pgConfig: {
                with: this.config.with,
                using: this.config.using,
                tablespace: this.config.tablespace,
                withNoData: this.config.withNoData,
            },
            config: {
                name: this.name,
                schema: this.schema,
                selectedFields: aliasedSelection,
                query: qb.getSQL().inlineParams(),
            },
        }), selectionProxy);
    }
}
export class ManualMaterializedViewBuilder extends MaterializedViewBuilderCore {
    static [entityKind] = 'PgManualMaterializedViewBuilder';
    columns;
    constructor(name, columns, schema) {
        super(name, schema);
        this.columns = getTableColumns(pgTable(name, columns));
    }
    existing() {
        return new Proxy(new PgMaterializedView({
            pgConfig: {
                tablespace: this.config.tablespace,
                using: this.config.using,
                with: this.config.with,
                withNoData: this.config.withNoData,
            },
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
        return new Proxy(new PgMaterializedView({
            pgConfig: {
                tablespace: this.config.tablespace,
                using: this.config.using,
                with: this.config.with,
                withNoData: this.config.withNoData,
            },
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
export class PgView extends PgViewBase {
    static [entityKind] = 'PgView';
    [PgViewConfig];
    constructor({ pgConfig, config }) {
        super(config);
        if (pgConfig) {
            this[PgViewConfig] = {
                with: pgConfig.with,
            };
        }
    }
}
export const PgMaterializedViewConfig = Symbol.for('drizzle:PgMaterializedViewConfig');
export class PgMaterializedView extends PgViewBase {
    static [entityKind] = 'PgMaterializedView';
    [PgMaterializedViewConfig];
    constructor({ pgConfig, config }) {
        super(config);
        this[PgMaterializedViewConfig] = {
            with: pgConfig?.with,
            using: pgConfig?.using,
            tablespace: pgConfig?.tablespace,
            withNoData: pgConfig?.withNoData,
        };
    }
}
/** @internal */
export function pgViewWithSchema(name, selection, schema) {
    if (selection) {
        return new ManualViewBuilder(name, selection, schema);
    }
    return new ViewBuilder(name, schema);
}
/** @internal */
export function pgMaterializedViewWithSchema(name, selection, schema) {
    if (selection) {
        return new ManualMaterializedViewBuilder(name, selection, schema);
    }
    return new MaterializedViewBuilder(name, schema);
}
export function pgView(name, columns) {
    return pgViewWithSchema(name, columns, undefined);
}
export function pgMaterializedView(name, columns) {
    return pgMaterializedViewWithSchema(name, columns, undefined);
}
export function isPgView(obj) {
    return is(obj, PgView);
}
export function isPgMaterializedView(obj) {
    return is(obj, PgMaterializedView);
}
//# sourceMappingURL=view.js.map