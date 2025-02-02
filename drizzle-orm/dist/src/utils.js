import { Column } from './column.ts';
import { is } from './entity.ts';
import { Param, SQL, View } from './sql/sql.ts';
import { Subquery } from './subquery.ts';
import { getTableName, Table } from './table.ts';
import { ViewBaseConfig } from './view-common.ts';
/** @internal */
export function mapResultRow(columns, row, joinsNotNullableMap) {
    // Key -> nested object key, value -> table name if all fields in the nested object are from the same table, false otherwise
    const nullifyMap = {};
    const result = columns.reduce((result, { path, field }, columnIndex) => {
        let decoder;
        if (is(field, Column)) {
            decoder = field;
        }
        else if (is(field, SQL)) {
            decoder = field.decoder;
        }
        else {
            decoder = field.sql.decoder;
        }
        let node = result;
        for (const [pathChunkIndex, pathChunk] of path.entries()) {
            if (pathChunkIndex < path.length - 1) {
                if (!(pathChunk in node)) {
                    node[pathChunk] = {};
                }
                node = node[pathChunk];
            }
            else {
                const rawValue = row[columnIndex];
                const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
                if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
                    const objectName = path[0];
                    if (!(objectName in nullifyMap)) {
                        nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
                    }
                    else if (typeof nullifyMap[objectName] === 'string' && nullifyMap[objectName] !== getTableName(field.table)) {
                        nullifyMap[objectName] = false;
                    }
                }
            }
        }
        return result;
    }, {});
    // Nullify all nested objects from nullifyMap that are nullable
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
        for (const [objectName, tableName] of Object.entries(nullifyMap)) {
            if (typeof tableName === 'string' && !joinsNotNullableMap[tableName]) {
                result[objectName] = null;
            }
        }
    }
    return result;
}
/** @internal */
export function orderSelectedFields(fields, pathPrefix) {
    return Object.entries(fields).reduce((result, [name, field]) => {
        if (typeof name !== 'string') {
            return result;
        }
        const newPath = pathPrefix ? [...pathPrefix, name] : [name];
        if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
            result.push({ path: newPath, field });
        }
        else if (is(field, Table)) {
            result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
        }
        else {
            result.push(...orderSelectedFields(field, newPath));
        }
        return result;
    }, []);
}
export function haveSameKeys(left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
        return false;
    }
    for (const [index, key] of leftKeys.entries()) {
        if (key !== rightKeys[index]) {
            return false;
        }
    }
    return true;
}
/** @internal */
export function mapUpdateSet(table, values) {
    const entries = Object.entries(values)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
        // eslint-disable-next-line unicorn/prefer-ternary
        if (is(value, SQL) || is(value, Column)) {
            return [key, value];
        }
        else {
            return [key, new Param(value, table[Table.Symbol.Columns][key])];
        }
    });
    if (entries.length === 0) {
        throw new Error('No values to set');
    }
    return Object.fromEntries(entries);
}
/** @internal */
export function applyMixins(baseClass, extendedClasses) {
    for (const extendedClass of extendedClasses) {
        for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
            if (name === 'constructor')
                continue;
            Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
        }
    }
}
export function getTableColumns(table) {
    return table[Table.Symbol.Columns];
}
export function getViewSelectedFields(view) {
    return view[ViewBaseConfig].selectedFields;
}
/** @internal */
export function getTableLikeName(table) {
    return is(table, Subquery)
        ? table._.alias
        : is(table, View)
            ? table[ViewBaseConfig].name
            : is(table, SQL)
                ? undefined
                : table[Table.Symbol.IsAlias]
                    ? table[Table.Symbol.Name]
                    : table[Table.Symbol.BaseName];
}
/** @internal */
export function getColumnNameAndConfig(a, b) {
    return {
        name: typeof a === 'string' && a.length > 0 ? a : '',
        config: typeof a === 'object' ? a : b,
    };
}
// If this errors, you must update config shape checker function with new config specs
const _ = {};
const __ = {};
export function isConfig(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    if (data.constructor.name !== 'Object')
        return false;
    if ('logger' in data) {
        const type = typeof data['logger'];
        if (type !== 'boolean' && (type !== 'object' || typeof data['logger']['logQuery'] !== 'function')
            && type !== 'undefined')
            return false;
        return true;
    }
    if ('schema' in data) {
        const type = typeof data['logger'];
        if (type !== 'object' && type !== 'undefined')
            return false;
        return true;
    }
    if ('casing' in data) {
        const type = typeof data['logger'];
        if (type !== 'string' && type !== 'undefined')
            return false;
        return true;
    }
    if ('mode' in data) {
        if (data['mode'] !== 'default' || data['mode'] !== 'planetscale' || data['mode'] !== undefined)
            return false;
        return true;
    }
    if ('connection' in data) {
        const type = typeof data['connection'];
        if (type !== 'string' && type !== 'object' && type !== 'undefined')
            return false;
        return true;
    }
    if ('client' in data) {
        const type = typeof data['client'];
        if (type !== 'object' && type !== 'function' && type !== 'undefined')
            return false;
        return true;
    }
    if (Object.keys(data).length === 0)
        return true;
    return false;
}
//# sourceMappingURL=utils.js.map