import { neonConfig, Pool } from '@neondatabase/serverless';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { NeonSession } from './session.ts';
export class NeonDriver {
    client;
    dialect;
    options;
    static [entityKind] = 'NeonDriver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
    }
    createSession(schema) {
        return new NeonSession(this.client, this.dialect, schema, { logger: this.options.logger });
    }
}
export class NeonDatabase extends PgDatabase {
    static [entityKind] = 'NeonServerlessDatabase';
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
    const driver = new NeonDriver(client, dialect, { logger });
    const session = driver.createSession(schema);
    const db = new NeonDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = new Pool({
            connectionString: params[0],
        });
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ws, ...drizzleConfig } = params[0];
        if (ws) {
            neonConfig.webSocketConstructor = ws;
        }
        if (client)
            return construct(client, drizzleConfig);
        const instance = typeof connection === 'string'
            ? new Pool({
                connectionString: connection,
            })
            : new Pool(connection);
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