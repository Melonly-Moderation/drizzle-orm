import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import { SQLiteAsyncDialect } from '~/sqlite-core/dialect.ts';
import { OPSQLiteSession } from './session.ts';
export class OPSQLiteDatabase extends BaseSQLiteDatabase {
    static [entityKind] = 'OPSQLiteDatabase';
}
export function drizzle(client, config = {}) {
    const dialect = new SQLiteAsyncDialect({ casing: config.casing });
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
    const session = new OPSQLiteSession(client, dialect, schema, { logger });
    const db = new OPSQLiteDatabase('async', dialect, session, schema);
    db.$client = client;
    return db;
}
//# sourceMappingURL=driver.js.map