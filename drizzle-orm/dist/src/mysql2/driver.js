import { createPool } from 'mysql2';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/db.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { DrizzleError } from '../errors.ts';
import { MySql2Session } from './session.ts';
export class MySql2Driver {
    client;
    dialect;
    options;
    static [entityKind] = 'MySql2Driver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
    }
    createSession(schema, mode) {
        return new MySql2Session(this.client, this.dialect, schema, { logger: this.options.logger, mode });
    }
}
export { MySqlDatabase } from '~/mysql-core/db.ts';
export class MySql2Database extends MySqlDatabase {
    static [entityKind] = 'MySql2Database';
}
function construct(client, config = {}) {
    const dialect = new MySqlDialect({ casing: config.casing });
    let logger;
    if (config.logger === true) {
        logger = new DefaultLogger();
    }
    else if (config.logger !== false) {
        logger = config.logger;
    }
    const clientForInstance = isCallbackClient(client) ? client.promise() : client;
    let schema;
    if (config.schema) {
        if (config.mode === undefined) {
            throw new DrizzleError({
                message: 'You need to specify "mode": "planetscale" or "default" when providing a schema. Read more: https://orm.drizzle.team/docs/rqb#modes',
            });
        }
        const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const mode = config.mode ?? 'default';
    const driver = new MySql2Driver(clientForInstance, dialect, { logger });
    const session = driver.createSession(schema, mode);
    const db = new MySql2Database(dialect, session, schema, mode);
    db.$client = client;
    return db;
}
function isCallbackClient(client) {
    return typeof client.promise === 'function';
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const connectionString = params[0];
        const instance = createPool({
            uri: connectionString,
        });
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        const instance = typeof connection === 'string'
            ? createPool({
                uri: connection,
            })
            : createPool(connection);
        const db = construct(instance, drizzleConfig);
        return db;
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