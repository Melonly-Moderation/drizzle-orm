import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { PgRemoteSession } from './session.ts';
export class PgRemoteDatabase extends PgDatabase {
    static [entityKind] = 'PgRemoteDatabase';
}
export function drizzle(callback, config = {}, _dialect = () => new PgDialect({ casing: config.casing })) {
    const dialect = _dialect();
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
    const session = new PgRemoteSession(callback, dialect, schema, { logger });
    return new PgRemoteDatabase(dialect, session, schema);
}
//# sourceMappingURL=driver.js.map