import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgBigSerial53Builder extends PgColumnBuilder {
    static [entityKind] = 'PgBigSerial53Builder';
    constructor(name) {
        super(name, 'number', 'PgBigSerial53');
        this.config.hasDefault = true;
        this.config.notNull = true;
    }
    /** @internal */
    build(table) {
        return new PgBigSerial53(table, this.config);
    }
}
export class PgBigSerial53 extends PgColumn {
    static [entityKind] = 'PgBigSerial53';
    getSQLType() {
        return 'bigserial';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }
}
export class PgBigSerial64Builder extends PgColumnBuilder {
    static [entityKind] = 'PgBigSerial64Builder';
    constructor(name) {
        super(name, 'bigint', 'PgBigSerial64');
        this.config.hasDefault = true;
    }
    /** @internal */
    build(table) {
        return new PgBigSerial64(table, this.config);
    }
}
export class PgBigSerial64 extends PgColumn {
    static [entityKind] = 'PgBigSerial64';
    getSQLType() {
        return 'bigserial';
    }
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    mapFromDriverValue(value) {
        return BigInt(value);
    }
}
export function bigserial(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config.mode === 'number') {
        return new PgBigSerial53Builder(name);
    }
    return new PgBigSerial64Builder(name);
}
//# sourceMappingURL=bigserial.js.map