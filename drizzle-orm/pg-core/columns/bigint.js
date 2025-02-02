import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn } from './common.ts';
import { PgIntColumnBaseBuilder } from './int.common.ts';
export class PgBigInt53Builder extends PgIntColumnBaseBuilder {
    static [entityKind] = 'PgBigInt53Builder';
    constructor(name) {
        super(name, 'number', 'PgBigInt53');
    }
    /** @internal */
    build(table) {
        return new PgBigInt53(table, this.config);
    }
}
export class PgBigInt53 extends PgColumn {
    static [entityKind] = 'PgBigInt53';
    getSQLType() {
        return 'bigint';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }
}
export class PgBigInt64Builder extends PgIntColumnBaseBuilder {
    static [entityKind] = 'PgBigInt64Builder';
    constructor(name) {
        super(name, 'bigint', 'PgBigInt64');
    }
    /** @internal */
    build(table) {
        return new PgBigInt64(table, this.config);
    }
}
export class PgBigInt64 extends PgColumn {
    static [entityKind] = 'PgBigInt64';
    getSQLType() {
        return 'bigint';
    }
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    mapFromDriverValue(value) {
        return BigInt(value);
    }
}
export function bigint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config.mode === 'number') {
        return new PgBigInt53Builder(name);
    }
    return new PgBigInt64Builder(name);
}
//# sourceMappingURL=bigint.js.map