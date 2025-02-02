/// <reference types="bun-types" />
import { Database } from 'bun:sqlite';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import { SQLiteSyncDialect } from '~/sqlite-core/dialect.ts';
import { isConfig } from '~/utils.ts';
import { SQLiteBunSession } from './session.ts';
export class BunSQLiteDatabase extends BaseSQLiteDatabase {
    static [entityKind] = 'BunSQLiteDatabase';
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
    const session = new SQLiteBunSession(client, dialect, schema, { logger });
    const db = new BunSQLiteDatabase('sync', dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (params[0] === undefined || typeof params[0] === 'string') {
        const instance = params[0] === undefined ? new Database() : new Database(params[0]);
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        if (typeof connection === 'object') {
            const { source, ...opts } = connection;
            const options = Object.values(opts).filter((v) => v !== undefined).length ? opts : undefined;
            const instance = new Database(source, options);
            return construct(instance, drizzleConfig);
        }
        const instance = new Database(connection);
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