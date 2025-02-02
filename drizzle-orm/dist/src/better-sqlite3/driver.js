import Client from 'better-sqlite3';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import { SQLiteSyncDialect } from '~/sqlite-core/dialect.ts';
import { isConfig } from '~/utils.ts';
import { BetterSQLiteSession } from './session.ts';
export class BetterSQLite3Database extends BaseSQLiteDatabase {
    static [entityKind] = 'BetterSQLite3Database';
}
function construct(client, config = {}) {
    const dialect = new SQLiteSyncDialect({ casing: config.casing });
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
    const session = new BetterSQLiteSession(client, dialect, schema, { logger });
    const db = new BetterSQLite3Database('sync', dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (params[0] === undefined || typeof params[0] === 'string') {
        const instance = params[0] === undefined ? new Client() : new Client(params[0]);
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        if (typeof connection === 'object') {
            const { source, ...options } = connection;
            const instance = new Client(source, options);
            return construct(instance, drizzleConfig);
        }
        const instance = new Client(connection);
        return construct(instance, drizzleConfig);
    }
    return construct(params[0], params[1]);
}
(function (drizzle) {
    function mock(config) {
        return construct({}, config);
    }
    drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//# sourceMappingURL=driver.js.map