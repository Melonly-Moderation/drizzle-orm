import pg from 'pg';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { NodePgSession } from './session.ts';
export class NodePgDriver {
    client;
    dialect;
    options;
    static [entityKind] = 'NodePgDriver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
    }
    createSession(schema) {
        return new NodePgSession(this.client, this.dialect, schema, { logger: this.options.logger });
    }
}
export class NodePgDatabase extends PgDatabase {
    static [entityKind] = 'NodePgDatabase';
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
    const driver = new NodePgDriver(client, dialect, { logger });
    const session = driver.createSession(schema);
    const db = new NodePgDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = new pg.Pool({
            connectionString: params[0],
        });
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        const instance = typeof connection === 'string'
            ? new pg.Pool({
                connectionString: connection,
            })
            : new pg.Pool(connection);
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