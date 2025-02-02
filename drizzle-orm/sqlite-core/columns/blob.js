import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export class SQLiteBigIntBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteBigIntBuilder';
    constructor(name) {
        super(name, 'bigint', 'SQLiteBigInt');
    }
    /** @internal */
    build(table) {
        return new SQLiteBigInt(table, this.config);
    }
}
export class SQLiteBigInt extends SQLiteColumn {
    static [entityKind] = 'SQLiteBigInt';
    getSQLType() {
        return 'blob';
    }
    mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
            return BigInt(value.toString());
        }
        // for sqlite durable objects
        // eslint-disable-next-line no-instanceof/no-instanceof
        if (value instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            return BigInt(decoder.decode(value));
        }
        return BigInt(String.fromCodePoint(...value));
    }
    mapToDriverValue(value) {
        return Buffer.from(value.toString());
    }
}
export class SQLiteBlobJsonBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteBlobJsonBuilder';
    constructor(name) {
        super(name, 'json', 'SQLiteBlobJson');
    }
    /** @internal */
    build(table) {
        return new SQLiteBlobJson(table, this.config);
    }
}
export class SQLiteBlobJson extends SQLiteColumn {
    static [entityKind] = 'SQLiteBlobJson';
    getSQLType() {
        return 'blob';
    }
    mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
            return JSON.parse(value.toString());
        }
        // for sqlite durable objects
        // eslint-disable-next-line no-instanceof/no-instanceof
        if (value instanceof ArrayBuffer) {
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(value));
        }
        return JSON.parse(String.fromCodePoint(...value));
    }
    mapToDriverValue(value) {
        return Buffer.from(JSON.stringify(value));
    }
}
export class SQLiteBlobBufferBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteBlobBufferBuilder';
    constructor(name) {
        super(name, 'buffer', 'SQLiteBlobBuffer');
    }
    /** @internal */
    build(table) {
        return new SQLiteBlobBuffer(table, this.config);
    }
}
export class SQLiteBlobBuffer extends SQLiteColumn {
    static [entityKind] = 'SQLiteBlobBuffer';
    getSQLType() {
        return 'blob';
    }
}
export function blob(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'json') {
        return new SQLiteBlobJsonBuilder(name);
    }
    if (config?.mode === 'bigint') {
        return new SQLiteBigIntBuilder(name);
    }
    return new SQLiteBlobBufferBuilder(name);
}
//# sourceMappingURL=blob.js.map