import { entityKind, is } from '~/entity.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { SelectionProxyHandler } from '~/selection-proxy.ts';
import { WithSubquery } from '~/subquery.ts';
import { PgSelectBuilder } from './select.ts';
export class QueryBuilder {
    static [entityKind] = 'PgQueryBuilder';
    dialect;
    dialectConfig;
    constructor(dialect) {
        this.dialect = is(dialect, PgDialect) ? dialect : undefined;
        this.dialectConfig = is(dialect, PgDialect) ? undefined : dialect;
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
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                withList: queries,
            });
        }
        function selectDistinct(fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                distinct: true,
            });
        }
        function selectDistinctOn(on, fields) {
            return new PgSelectBuilder({
                fields: fields ?? undefined,
                session: undefined,
                dialect: self.getDialect(),
                distinct: { on },
            });
        }
        return { select, selectDistinct, selectDistinctOn };
    }
    select(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
        });
    }
    selectDistinct(fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
            distinct: true,
        });
    }
    selectDistinctOn(on, fields) {
        return new PgSelectBuilder({
            fields: fields ?? undefined,
            session: undefined,
            dialect: this.getDialect(),
            distinct: { on },
        });
    }
    // Lazy load dialect to avoid circular dependency
    getDialect() {
        if (!this.dialect) {
            this.dialect = new PgDialect(this.dialectConfig);
        }
        return this.dialect;
    }
}
//# sourceMappingURL=query-builder.js.map