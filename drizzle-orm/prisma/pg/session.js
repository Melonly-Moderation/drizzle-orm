import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { PgPreparedQuery, PgSession } from '~/pg-core/index.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
export class PrismaPgPreparedQuery extends PgPreparedQuery {
    prisma;
    logger;
    static [entityKind] = 'PrismaPgPreparedQuery';
    constructor(prisma, query, logger) {
        super(query);
        this.prisma = prisma;
        this.logger = logger;
    }
    execute(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
    }
    all() {
        throw new Error('Method not implemented.');
    }
    isResponseInArrayMode() {
        return false;
    }
}
export class PrismaPgSession extends PgSession {
    prisma;
    options;
    static [entityKind] = 'PrismaPgSession';
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
    prepareQuery(query) {
        return new PrismaPgPreparedQuery(this.prisma, query, this.logger);
    }
    transaction(_transaction, _config) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=session.js.map