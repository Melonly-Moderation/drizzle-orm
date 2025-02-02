import { neon, types } from '@neondatabase/serverless';
import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig } from '~/relations.ts';
import { isConfig } from '~/utils.ts';
import { NeonHttpSession } from './session.ts';
export class NeonHttpDriver {
    client;
    dialect;
    options;
    static [entityKind] = 'NeonHttpDriver';
    constructor(client, dialect, options = {}) {
        this.client = client;
        this.dialect = dialect;
        this.options = options;
        this.initMappers();
    }
    createSession(schema) {
        return new NeonHttpSession(this.client, this.dialect, schema, { logger: this.options.logger });
    }
    initMappers() {
        types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => val);
        types.setTypeParser(types.builtins.TIMESTAMP, (val) => val);
        types.setTypeParser(types.builtins.DATE, (val) => val);
        types.setTypeParser(types.builtins.INTERVAL, (val) => val);
    }
}
function wrap(target, token, cb, deep) {
    return new Proxy(target, {
        get(target, p) {
            const element = target[p];
            if (typeof element !== 'function' && (typeof element !== 'object' || element === null))
                return element;
            if (deep)
                return wrap(element, token, cb);
            if (p === 'query')
                return wrap(element, token, cb, true);
            return new Proxy(element, {
                apply(target, thisArg, argArray) {
                    const res = target.call(thisArg, ...argArray);
                    if (typeof res === 'object' && res !== null && 'setToken' in res && typeof res.setToken === 'function') {
                        res.setToken(token);
                    }
                    return cb(target, p, res);
                },
            });
        },
    });
}
export class NeonHttpDatabase extends PgDatabase {
    static [entityKind] = 'NeonHttpDatabase';
    $withAuth(token) {
        this.authToken = token;
        return wrap(this, token, (target, p, res) => {
            if (p === 'with') {
                return wrap(res, token, (_, __, res) => res);
            }
            return res;
        });
    }
    async batch(batch) {
        return this.session.batch(batch);
    }
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
    const driver = new NeonHttpDriver(client, dialect, { logger });
    const session = driver.createSession(schema);
    const db = new NeonHttpDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = neon(params[0]);
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        if (typeof connection === 'object') {
            const { connectionString, ...options } = connection;
            const instance = neon(connectionString, options);
            return construct(instance, drizzleConfig);
        }
        const instance = neon(connection);
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