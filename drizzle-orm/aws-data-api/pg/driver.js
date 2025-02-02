import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { entityKind, is } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { PgArray } from '~/pg-core/index.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig, } from '~/relations.ts';
import { Param, sql } from '~/sql/sql.ts';
import { Table } from '~/table.ts';
import { AwsDataApiSession } from './session.ts';
export class AwsDataApiPgDatabase extends PgDatabase {
    static [entityKind] = 'AwsDataApiPgDatabase';
    execute(query) {
        return super.execute(query);
    }
}
export class AwsPgDialect extends PgDialect {
    static [entityKind] = 'AwsPgDialect';
    escapeParam(num) {
        return `:${num + 1}`;
    }
    buildInsertQuery({ table, values, onConflict, returning, select, withList }) {
        const columns = table[Table.Symbol.Columns];
        if (!select) {
            for (const value of values) {
                for (const fieldName of Object.keys(columns)) {
                    const colValue = value[fieldName];
                    if (is(colValue, Param) && colValue.value !== undefined && is(colValue.encoder, PgArray)
                        && Array.isArray(colValue.value)) {
                        value[fieldName] = sql `cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
                    }
                }
            }
        }
        return super.buildInsertQuery({ table, values, onConflict, returning, withList });
    }
    buildUpdateSet(table, set) {
        const columns = table[Table.Symbol.Columns];
        for (const [colName, colValue] of Object.entries(set)) {
            const currentColumn = columns[colName];
            if (currentColumn && is(colValue, Param) && colValue.value !== undefined && is(colValue.encoder, PgArray)
                && Array.isArray(colValue.value)) {
                set[colName] = sql `cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
            }
        }
        return super.buildUpdateSet(table, set);
    }
}
function construct(client, config) {
    const dialect = new AwsPgDialect({ casing: config.casing });
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
    const session = new AwsDataApiSession(client, dialect, schema, { ...config, logger }, undefined);
    const db = new AwsDataApiPgDatabase(dialect, session, schema);
    db.$client = client;
    return db;
}
export function drizzle(...params) {
    // eslint-disable-next-line no-instanceof/no-instanceof
    if (params[0] instanceof RDSDataClient) {
        return construct(params[0], params[1]);
    }
    if (params[0].client) {
        const { client, ...drizzleConfig } = params[0];
        return construct(client, drizzleConfig);
    }
    const { connection, ...drizzleConfig } = params[0];
    const { resourceArn, database, secretArn, ...rdsConfig } = connection;
    const instance = new RDSDataClient(rdsConfig);
    return construct(instance, { resourceArn, database, secretArn, ...drizzleConfig });
}
(function (drizzle) {
    function mock(config) {
        return construct({}, config);
    }
    drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//# sourceMappingURL=driver.js.map