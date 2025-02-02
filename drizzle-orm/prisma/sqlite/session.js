import { entityKind } from '~/entity.ts';
import { NoopLogger } from '~/logger.ts';
import { fillPlaceholders } from '~/sql/sql.ts';
import { SQLitePreparedQuery, SQLiteSession } from '~/sqlite-core/index.ts';
export class PrismaSQLitePreparedQuery extends SQLitePreparedQuery {
    prisma;
    logger;
    static [entityKind] = 'PrismaSQLitePreparedQuery';
    constructor(prisma, query, logger, executeMethod) {
        super('async', executeMethod, query);
        this.prisma = prisma;
        this.logger = logger;
    }
    all(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
    }
    async run(placeholderValues) {
        await this.all(placeholderValues);
        return [];
    }
    async get(placeholderValues) {
        const all = await this.all(placeholderValues);
        return all[0];
    }
    values(_placeholderValues) {
        throw new Error('Method not implemented.');
    }
    isResponseInArrayMode() {
        return false;
    }
}
export class PrismaSQLiteSession extends SQLiteSession {
    prisma;
    static [entityKind] = 'PrismaSQLiteSession';
    logger;
    constructor(prisma, dialect, options) {
        super(dialect);
        this.prisma = prisma;
        this.logger = options.logger ?? new NoopLogger();
    }
    prepareQuery(query, fields, executeMethod) {
        return new PrismaSQLitePreparedQuery(this.prisma, query, this.logger, executeMethod);
    }
    transaction(_transaction, _config) {
        throw new Error('Method not implemented.');
    }
}
//# sourceMappingURL=session.js.map