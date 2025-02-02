import { Prisma } from '@prisma/client';
import { DefaultLogger } from '~/logger.ts';
import { BaseSQLiteDatabase, SQLiteAsyncDialect } from '~/sqlite-core/index.ts';
import { PrismaSQLiteSession } from './session.ts';
export function drizzle(config = {}) {
    const dialect = new SQLiteAsyncDialect();
    let logger;
    if (config.logger === true) {
        logger = new DefaultLogger();
    }
    else if (config.logger !== false) {
        logger = config.logger;
    }
    return Prisma.defineExtension((client) => {
        const session = new PrismaSQLiteSession(client, dialect, { logger });
        return client.$extends({
            name: 'drizzle',
            client: {
                $drizzle: new BaseSQLiteDatabase('async', dialect, session, undefined),
            },
        });
    });
}
//# sourceMappingURL=driver.js.map