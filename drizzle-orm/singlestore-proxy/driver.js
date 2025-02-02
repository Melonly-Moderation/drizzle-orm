import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { SingleStoreDatabase } from '~/singlestore-core/db.ts';
import { SingleStoreDialect } from '~/singlestore-core/dialect.ts';
import { SingleStoreRemoteSession, } from './session.ts';
export class SingleStoreRemoteDatabase extends SingleStoreDatabase {
    static [entityKind] = 'SingleStoreRemoteDatabase';
}
export function drizzle(callback, config = {}) {
    const dialect = new SingleStoreDialect({ casing: config.casing });
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
    const session = new SingleStoreRemoteSession(callback, dialect, schema, { logger });
    return new SingleStoreRemoteDatabase(dialect, session, schema);
}
//# sourceMappingURL=driver.js.map