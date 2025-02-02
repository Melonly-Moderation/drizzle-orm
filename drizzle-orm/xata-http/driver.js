import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig } from '~/relations.ts';
import { XataHttpSession } from './session.ts';
export class XataHttpDriver {
    client;
    dialect;
    options;
    static [entityKind] = 'XataDriver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
        this.initMappers();
    }
    createSession(schema) {
        return new XataHttpSession(this.client, this.dialect, schema, {
            logger: this.options.logger,
        });
    }
    initMappers() {
        // TODO: Add custom type parsers
    }
}
export class XataHttpDatabase extends PgDatabase {
    static [entityKind] = 'XataHttpDatabase';
}
export function drizzle(client, config = {}) {
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
    const driver = new XataHttpDriver(client, dialect, { logger });
    const session = driver.createSession(schema);
    const db = new XataHttpDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
//# sourceMappingURL=driver.js.map