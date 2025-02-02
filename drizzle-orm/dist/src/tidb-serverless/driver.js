import { connect } from '@tidbcloud/serverless';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/db.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { TiDBServerlessSession } from './session.ts';
export class TiDBServerlessDatabase extends MySqlDatabase {
    static [entityKind] = 'TiDBServerlessDatabase';
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
    let schema;
    if (config.schema) {
        const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const session = new TiDBServerlessSession(client, dialect, undefined, schema, { logger });
    const db = new TiDBServerlessDatabase(dialect, session, schema, 'default');
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = connect({
            url: params[0],
        });
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        const instance = typeof connection === 'string'
            ? connect({
                url: connection,
            })
            : connect(connection);
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