import { sql } from '@vercel/postgres';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/index.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { VercelPgSession } from './session.ts';
export class VercelPgDriver {
    client;
    dialect;
    options;
    static [entityKind] = 'VercelPgDriver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
    }
    createSession(schema) {
        return new VercelPgSession(this.client, this.dialect, schema, { logger: this.options.logger });
    }
}
export class VercelPgDatabase extends PgDatabase {
    static [entityKind] = 'VercelPgDatabase';
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
    const driver = new VercelPgDriver(client, dialect, { logger });
    const session = driver.createSession(schema);
    const db = new VercelPgDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (isConfig(params[0])) {
        const { client, ...drizzleConfig } = params[0];
        return construct(client ?? sql, drizzleConfig);
    }
    return construct((params[0] ?? sql), params[1]);
}
(function (drizzle) {
    function mock(config) {
        return construct({}, config);
    }
    drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//# sourceMappingURL=driver.js.map