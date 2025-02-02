import { entityKind } from '~/entity.ts';
import { TransactionRollbackError } from '~/errors.ts';
import { sql } from '~/sql/sql.ts';
import { MySqlDatabase } from './db.ts';
export class MySqlPreparedQuery {
    static [entityKind] = 'MySqlPreparedQuery';
    /** @internal */
    joinsNotNullableMap;
}
export class MySqlSession {
    dialect;
    static [entityKind] = 'MySqlSession';
    constructor(dialect) {
        this.dialect = dialect;
    }
    execute(query) {
        return this.prepareQuery(this.dialect.sqlToQuery(query), undefined).execute();
    }
    async count(sql) {
        const res = await this.execute(sql);
        return Number(res[0][0]['count']);
    }
    getSetTransactionSQL(config) {
        const parts = [];
        if (config.isolationLevel) {
            parts.push(`isolation level ${config.isolationLevel}`);
        }
        return parts.length ? sql `set transaction ${sql.raw(parts.join(' '))}` : undefined;
    }
    getStartTransactionSQL(config) {
        const parts = [];
        if (config.withConsistentSnapshot) {
            parts.push('with consistent snapshot');
        }
        if (config.accessMode) {
            parts.push(config.accessMode);
        }
        return parts.length ? sql `start transaction ${sql.raw(parts.join(' '))}` : undefined;
    }
}
export class MySqlTransaction extends MySqlDatabase {
    schema;
    nestedIndex;
    static [entityKind] = 'MySqlTransaction';
    constructor(dialect, session, schema, nestedIndex, mode) {
        super(dialect, session, schema, mode);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
    }
    rollback() {
        throw new TransactionRollbackError();
    }
}
//# sourceMappingURL=session.js.map