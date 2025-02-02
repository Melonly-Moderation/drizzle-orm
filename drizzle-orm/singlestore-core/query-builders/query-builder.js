import { entityKind, is } from '~/entity.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { SingleStoreDialect } from '~/singlestore-core/dialect.ts';
import { WithSubquery } from '~/subquery.ts';
import { SingleStoreSelectBuilder } from './select.ts';
export class QueryBuilder {
    static [entityKind] = 'SingleStoreQueryBuilder';
    dialect;
    dialectConfig;
    constructor(dialect) {
        this.dialect = is(dialect, SingleStoreDialect) ? dialect : undefined;
        this.dialectConfig = is(dialect, SingleStoreDialect) ? undefined : dialect;
    }
    $with = (alias, selection) => {
        const queryBuilder = this;
        const as = (qb) => {
            if (typeof qb === 'function') {
                qb = qb(queryBuilder);
            }
            return new Proxy(new WithSubquery(qb.getSQL(), selection ?? ('getSelectedFields' in qb ? qb.getSelectedFields() ?? {} : {}), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: 'alias', sqlBehavior: 'error' }));
        };
        return { as };
    };
    with(...queries) {
        const self = this;
        function select(fields) {
            return new SingleStoreSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                withList: queries,
            });
        }
        function selectDistinct(fields) {
            return new SingleStoreSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                withList: queries,
                distinct: true,
            });
        }
        return { select, selectDistinct };
    }
    select(fields) {
        return new SingleStoreSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
        });
    }
    selectDistinct(fields) {
        return new SingleStoreSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
            distinct: true,
        });
    }
    // Lazy load dialect to avoid circular dependency
    getDialect() {
        if (!this.dialect) {
            this.dialect = new SingleStoreDialect(this.dialectConfig);
        }
        return this.dialect;
    }
}
//# sourceMappingURL=query-builder.js.map