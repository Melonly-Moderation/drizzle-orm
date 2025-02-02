import { z } from 'zod';
import { z as zod } from 'zod';
import { CONSTANTS } from './constants.ts';
import { isColumnType, isWithEnum } from './utils.ts';
export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export const jsonSchema = z.union([literalSchema, z.record(z.any()), z.array(z.any())]);
export const bufferSchema = z.custom((v) => v instanceof Buffer); // eslint-disable-line no-instanceof/no-instanceof
export function columnToSchema(column, factory) {
    const z = factory?.zodInstance ?? zod;
    const coerce = factory?.coerce ?? {};
    let schema;
    if (isWithEnum(column)) {
        schema = column.enumValues.length ? z.enum(column.enumValues) : z.string();
    }
    if (!schema) {
        // Handle specific types
        if (isColumnType(column, ['PgGeometry', 'PgPointTuple'])) {
            schema = z.tuple([z.number(), z.number()]);
        }
        else if (isColumnType(column, ['PgGeometryObject', 'PgPointObject'])) {
            schema = z.object({ x: z.number(), y: z.number() });
        }
        else if (isColumnType(column, ['PgHalfVector', 'PgVector'])) {
            schema = z.array(z.number());
            schema = column.dimensions ? schema.length(column.dimensions) : schema;
        }
        else if (isColumnType(column, ['PgLine'])) {
            schema = z.tuple([z.number(), z.number(), z.number()]);
        }
        else if (isColumnType(column, ['PgLineABC'])) {
            schema = z.object({
                a: z.number(),
                b: z.number(),
                c: z.number(),
            });
        } // Handle other types
        else if (isColumnType(column, ['PgArray'])) {
            schema = z.array(columnToSchema(column.baseColumn, z));
            schema = column.size ? schema.length(column.size) : schema;
        }
        else if (column.dataType === 'array') {
            schema = z.array(z.any());
        }
        else if (column.dataType === 'number') {
            schema = numberColumnToSchema(column, z, coerce);
        }
        else if (column.dataType === 'bigint') {
            schema = bigintColumnToSchema(column, z, coerce);
        }
        else if (column.dataType === 'boolean') {
            schema = coerce === true || coerce.boolean ? z.coerce.boolean() : z.boolean();
        }
        else if (column.dataType === 'date') {
            schema = coerce === true || coerce.date ? z.coerce.date() : z.date();
        }
        else if (column.dataType === 'string') {
            schema = stringColumnToSchema(column, z, coerce);
        }
        else if (column.dataType === 'json') {
            schema = jsonSchema;
        }
        else if (column.dataType === 'custom') {
            schema = z.any();
        }
        else if (column.dataType === 'buffer') {
            schema = bufferSchema;
        }
    }
    if (!schema) {
        schema = z.any();
    }
    return schema;
}
function numberColumnToSchema(column, z, coerce) {
    let unsigned = column.getSQLType().includes('unsigned');
    let min;
    let max;
    let integer = false;
    if (isColumnType(column, ['MySqlTinyInt', 'SingleStoreTinyInt'])) {
        min = unsigned ? 0 : CONSTANTS.INT8_MIN;
        max = unsigned ? CONSTANTS.INT8_UNSIGNED_MAX : CONSTANTS.INT8_MAX;
        integer = true;
    }
    else if (isColumnType(column, [
        'PgSmallInt',
        'PgSmallSerial',
        'MySqlSmallInt',
        'SingleStoreSmallInt',
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT16_MIN;
        max = unsigned ? CONSTANTS.INT16_UNSIGNED_MAX : CONSTANTS.INT16_MAX;
        integer = true;
    }
    else if (isColumnType(column, [
        'PgReal',
        'MySqlFloat',
        'MySqlMediumInt',
        'SingleStoreMediumInt',
        'SingleStoreFloat',
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT24_MIN;
        max = unsigned ? CONSTANTS.INT24_UNSIGNED_MAX : CONSTANTS.INT24_MAX;
        integer = isColumnType(column, ['MySqlMediumInt', 'SingleStoreMediumInt']);
    }
    else if (isColumnType(column, [
        'PgInteger',
        'PgSerial',
        'MySqlInt',
        'SingleStoreInt',
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT32_MIN;
        max = unsigned ? CONSTANTS.INT32_UNSIGNED_MAX : CONSTANTS.INT32_MAX;
        integer = true;
    }
    else if (isColumnType(column, [
        'PgDoublePrecision',
        'MySqlReal',
        'MySqlDouble',
        'SingleStoreReal',
        'SingleStoreDouble',
        'SQLiteReal',
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT48_MIN;
        max = unsigned ? CONSTANTS.INT48_UNSIGNED_MAX : CONSTANTS.INT48_MAX;
    }
    else if (isColumnType(column, [
        'PgBigInt53',
        'PgBigSerial53',
        'MySqlBigInt53',
        'MySqlSerial',
        'SingleStoreBigInt53',
        'SingleStoreSerial',
        'SQLiteInteger',
    ])) {
        unsigned = unsigned || isColumnType(column, ['MySqlSerial', 'SingleStoreSerial']);
        min = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
        max = Number.MAX_SAFE_INTEGER;
        integer = true;
    }
    else if (isColumnType(column, ['MySqlYear', 'SingleStoreYear'])) {
        min = 1901;
        max = 2155;
        integer = true;
    }
    else {
        min = Number.MIN_SAFE_INTEGER;
        max = Number.MAX_SAFE_INTEGER;
    }
    let schema = coerce === true || coerce?.number ? z.coerce.number() : z.number();
    schema = schema.min(min).max(max);
    return integer ? schema.int() : schema;
}
function bigintColumnToSchema(column, z, coerce) {
    const unsigned = column.getSQLType().includes('unsigned');
    const min = unsigned ? 0n : CONSTANTS.INT64_MIN;
    const max = unsigned ? CONSTANTS.INT64_UNSIGNED_MAX : CONSTANTS.INT64_MAX;
    const schema = coerce === true || coerce?.bigint ? z.coerce.bigint() : z.bigint();
    return schema.min(min).max(max);
}
function stringColumnToSchema(column, z, coerce) {
    if (isColumnType(column, ['PgUUID'])) {
        return z.string().uuid();
    }
    let max;
    let regex;
    let fixed = false;
    if (isColumnType(column, ['PgVarchar', 'SQLiteText'])) {
        max = column.length;
    }
    else if (isColumnType(column, ['MySqlVarChar', 'SingleStoreVarChar'])) {
        max = column.length ?? CONSTANTS.INT16_UNSIGNED_MAX;
    }
    else if (isColumnType(column, ['MySqlText', 'SingleStoreText'])) {
        if (column.textType === 'longtext') {
            max = CONSTANTS.INT32_UNSIGNED_MAX;
        }
        else if (column.textType === 'mediumtext') {
            max = CONSTANTS.INT24_UNSIGNED_MAX;
        }
        else if (column.textType === 'text') {
            max = CONSTANTS.INT16_UNSIGNED_MAX;
        }
        else {
            max = CONSTANTS.INT8_UNSIGNED_MAX;
        }
    }
    if (isColumnType(column, [
        'PgChar',
        'MySqlChar',
        'SingleStoreChar',
    ])) {
        max = column.length;
        fixed = true;
    }
    if (isColumnType(column, ['PgBinaryVector'])) {
        regex = /^[01]+$/;
        max = column.dimensions;
    }
    let schema = coerce === true || coerce?.string ? z.coerce.string() : z.string();
    schema = regex ? schema.regex(regex) : schema;
    return max && fixed ? schema.length(max) : max ? schema.max(max) : schema;
}
//# sourceMappingURL=column.js.map