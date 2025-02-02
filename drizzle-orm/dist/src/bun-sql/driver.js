/// <reference types="bun-types" />
import { SQL } from 'bun';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { BunSQLSession } from './session.ts';
export class BunSQLDatabase extends PgDatabase {
    static [entityKind] = 'BunSQLDatabase';
}
function construct(client, config = {}) {
    const dialect = new PgDialect({ casing: config.casing });
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
    const session = new BunSQLSession(client, dialect, schema, { logger });
    const db = new BunSQLDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = new SQL(params[0]);
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        if (typeof connection === 'object' && connection.url !== undefined) {
            const { url, ...config } = connection;
            const instance = new SQL({ url, ...config });
            return construct(instance, drizzleConfig);
        }
        const instance = new SQL(connection);
        return construct(instance, drizzleConfig);
    }
    return construct(params[0], params[1]);
}
(function (drizzle) {
    function mock(config) {
        return construct({
            options: {
                parsers: {},
                serializers: {},
            },
        }, config);
    }
    drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//# sourceMappingURL=driver.js.map