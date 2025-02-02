import { Prisma } from '@prisma/client';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { MySqlDatabase, MySqlDialect } from '~/mysql-core/index.ts';
import { PrismaMySqlSession } from './session.ts';
export class PrismaMySqlDatabase extends MySqlDatabase {
    static [entityKind] = 'PrismaMySqlDatabase';
    constructor(client, logger) {
        const dialect = new MySqlDialect();
        super(dialect, new PrismaMySqlSession(dialect, client, { logger }), undefined, 'default');
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
                $drizzle: new PrismaMySqlDatabase(client, logger),
            },
        });
    });
}
//# sourceMappingURL=driver.js.map