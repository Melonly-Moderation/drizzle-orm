import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlBigInt53Builder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlBigInt53Builder';
    constructor(name, unsigned = false) {
        super(name, 'number', 'MySqlBigInt53');
        this.config.unsigned = unsigned;
    }
    /** @internal */
    build(table) {
        return new MySqlBigInt53(table, this.config);
    }
}
export class MySqlBigInt53 extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlBigInt53';
    getSQLType() {
        return `bigint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }
}
export class MySqlBigInt64Builder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlBigInt64Builder';
    constructor(name, unsigned = false) {
        super(name, 'bigint', 'MySqlBigInt64');
        this.config.unsigned = unsigned;
    }
    /** @internal */
    build(table) {
        return new MySqlBigInt64(table, this.config);
    }
}
export class MySqlBigInt64 extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlBigInt64';
    getSQLType() {
        return `bigint${this.config.unsigned ? ' unsigned' : ''}`;
    }
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    mapFromDriverValue(value) {
        return BigInt(value);
    }
}
export function bigint(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config.mode === 'number') {
        return new MySqlBigInt53Builder(name, config.unsigned);
    }
    return new MySqlBigInt64Builder(name, config.unsigned);
}
//# sourceMappingURL=bigint.js.map