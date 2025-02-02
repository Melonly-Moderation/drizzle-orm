import { Prisma } from '@prisma/client';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase, PgDialect } from '~/pg-core/index.ts';
import { PrismaPgSession } from './session.ts';
export class PrismaPgDatabase extends PgDatabase {
    static [entityKind] = 'PrismaPgDatabase';
    constructor(client, logger) {
        const dialect = new PgDialect();
        super(dialect, new PrismaPgSession(dialect, client, { logger }), undefined);
    }
}
export function drizzle(config = {}) {
    let logger;
    if (config.logger === true) {
        logger = new DefaultLogger();
    }
    else if (config.logger !== false) {
        logger = config.logger;
    }
    return Prisma.defineExtension((client) => {
        return client.$extends({
            name: 'drizzle',
            client: {
                $drizzle: new PrismaPgDatabase(client, logger),
            },
        });
    });
}
//# sourceMappingURL=driver.js.map