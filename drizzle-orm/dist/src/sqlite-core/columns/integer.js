import { entityKind } from '~/entity.ts';
import { sql } from '~/sql/sql.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export class SQLiteBaseIntegerBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteBaseIntegerBuilder';
    constructor(name, dataType, columnType) {
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
    }
    primaryKey(config) {
        if (config?.autoIncrement) {
            this.config.autoIncrement = true;
        }
        this.config.hasDefault = true;
        return super.primaryKey();
    }
}
export class SQLiteBaseInteger extends SQLiteColumn {
    static [entityKind] = 'SQLiteBaseInteger';
    autoIncrement = this.config.autoIncrement;
    getSQLType() {
        return 'integer';
    }
}
export class SQLiteIntegerBuilder extends SQLiteBaseIntegerBuilder {
    static [entityKind] = 'SQLiteIntegerBuilder';
    constructor(name) {
        super(name, 'number', 'SQLiteInteger');
    }
    build(table) {
        return new SQLiteInteger(table, this.config);
    }
}
export class SQLiteInteger extends SQLiteBaseInteger {
    static [entityKind] = 'SQLiteInteger';
}
export class SQLiteTimestampBuilder extends SQLiteBaseIntegerBuilder {
    static [entityKind] = 'SQLiteTimestampBuilder';
    constructor(name, mode) {
        super(name, 'date', 'SQLiteTimestamp');
        this.config.mode = mode;
    }
    /**
     * @deprecated Use `default()` with your own expression instead.
     *
     * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
     */
    defaultNow() {
        return this.default(sql `(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
    }
    build(table) {
        return new SQLiteTimestamp(table, this.config);
    }
}
export class SQLiteTimestamp extends SQLiteBaseInteger {
    static [entityKind] = 'SQLiteTimestamp';
    mode = this.config.mode;
    mapFromDriverValue(value) {
        if (this.config.mode === 'timestamp') {
            return new Date(value * 1000);
        }
        return new Date(value);
    }
    mapToDriverValue(value) {
        const unix = value.getTime();
        if (this.config.mode === 'timestamp') {
            return Math.floor(unix / 1000);
        }
        return unix;
    }
}
export class SQLiteBooleanBuilder extends SQLiteBaseIntegerBuilder {
    static [entityKind] = 'SQLiteBooleanBuilder';
    constructor(name, mode) {
        super(name, 'boolean', 'SQLiteBoolean');
        this.config.mode = mode;
    }
    build(table) {
        return new SQLiteBoolean(table, this.config);
    }
}
export class SQLiteBoolean extends SQLiteBaseInteger {
    static [entityKind] = 'SQLiteBoolean';
    mode = this.config.mode;
    mapFromDriverValue(value) {
        return Number(value) === 1;
    }
    mapToDriverValue(value) {
        return value ? 1 : 0;
    }
}
export function integer(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'timestamp' || config?.mode === 'timestamp_ms') {
        return new SQLiteTimestampBuilder(name, config.mode);
    }
    if (config?.mode === 'boolean') {
        return new SQLiteBooleanBuilder(name, config.mode);
    }
    return new SQLiteIntegerBuilder(name);
}
export const int = integer;
//# sourceMappingURL=integer.js.map