import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { MySqlPreparedQuery, MySqlSession } from '~/mysql-core/index.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
export class PrismaMySqlPreparedQuery extends MySqlPreparedQuery {
    prisma;
    query;
    logger;
    iterator(_placeholderValues) {
        throw new Error('Method not implemented.');
    }
    static [entityKind] = 'PrismaMySqlPreparedQuery';
    constructor(prisma, query, logger) {
        super();
        this.prisma = prisma;
        this.query = query;
        this.logger = logger;
    }
    execute(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
    }
}
export class PrismaMySqlSession extends MySqlSession {
    prisma;
    options;
    static [entityKind] = 'PrismaMySqlSession';
    logger;
    constructor(dialect, prisma, options) {
        super(dialect);
        this.prisma = prisma;
        this.options = options;
        this.logger = options.logger ?? new NoopLogger();
    }
    execute(query) {
        return this.prepareQuery(this.dialect.sqlToQuery(query)).execute();
    }
    all(_query) {
        throw new Error('Method not implemented.');
    }
    prepareQuery(query) {
        return new PrismaMySqlPreparedQuery(this.prisma, query, this.logger);
    }
    transaction(_transaction, _config) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=session.js.map