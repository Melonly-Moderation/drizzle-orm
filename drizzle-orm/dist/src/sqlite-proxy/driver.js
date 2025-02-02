import { entityKind } from '~/entity.ts';
import { DefaultLogger } from '~/logger.ts';
import { createTableRelationsHelpers, extractTablesRelationalConfig } from '~/relations.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import { SQLiteAsyncDialect } from '~/sqlite-core/dialect.ts';
import { SQLiteRemoteSession } from './session.ts';
export class SqliteRemoteDatabase extends BaseSQLiteDatabase {
    static [entityKind] = 'SqliteRemoteDatabase';
    async batch(batch) {
        return this.session.batch(batch);
    }
}
export function drizzle(callback, batchCallback, config) {
    const dialect = new SQLiteAsyncDialect({ casing: config?.casing });
    let logger;
    let _batchCallback;
    let _config = {};
    if (batchCallback) {
        if (typeof batchCallback === 'function') {
            _batchCallback = batchCallback;
            _config = config ?? {};
        }
        else {
            _batchCallback = undefined;
            _config = batchCallback;
        }
        if (_config.logger === true) {
            logger = new DefaultLogger();
        }
        else if (_config.logger !== false) {
            logger = _config.logger;
        }
    }
    let schema;
    if (_config.schema) {
        const tablesConfig = extractTablesRelationalConfig(_config.schema, createTableRelationsHelpers);
        schema = {
            fullSchema: _config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap,
        };
    }
    const session = new SQLiteRemoteSession(callback, dialect, schema, _batchCallback, { logger });
    return new SqliteRemoteDatabase('async', dialect, session, schema);
}
//# sourceMappingURL=driver.js.map