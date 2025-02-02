import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreBigInt53Builder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreBigInt53Builder';
    constructor(name, unsigned = false) {
        super(name, 'number', 'SingleStoreBigInt53');
        this.config.unsigned = unsigned;
    }
    /** @internal */
    build(table) {
        return new SingleStoreBigInt53(table, this.config);
    }
}
export class SingleStoreBigInt53 extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreBigInt53';
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
export class SingleStoreBigInt64Builder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreBigInt64Builder';
    constructor(name, unsigned = false) {
        super(name, 'bigint', 'SingleStoreBigInt64');
        this.config.unsigned = unsigned;
    }
    /** @internal */
    build(table) {
        return new SingleStoreBigInt64(table, this.config);
    }
}
export class SingleStoreBigInt64 extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreBigInt64';
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
        return new SingleStoreBigInt53Builder(name, config.unsigned);
    }
    return new SingleStoreBigInt64Builder(name, config.unsigned);
}
//# sourceMappingURL=bigint.js.map