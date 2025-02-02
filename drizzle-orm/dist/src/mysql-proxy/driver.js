import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/db.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { MySqlRemoteSession } from './session.ts';
export class MySqlRemoteDatabase extends MySqlDatabase {
    static [entityKind] = 'MySqlRemoteDatabase';
}
export function drizzle(callback, config = {}) {
    const dialect = new MySqlDialect({ casing: config.casing });
    let logger;
    if (config.logger === true) {
        logger = new DefaultLogger();
    }
    else if (config.logger !== false) {
        logger = config.logger;
    }
    let schema;
    if (config.schema) {
        const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const session = new MySqlRemoteSession(callback, dialect, schema, { logger });
    return new MySqlRemoteDatabase(dialect, session, schema, 'default');
}
//# sourceMappingURL=driver.js.map