import { entityKind, is } from '~/entity.ts';
import { isPgEnum } from '~/pg-core/columns/enum.ts';
import { Subquery } from '~/subquery.ts';
import { tracer } from '~/tracing.ts';
import { ViewBaseConfig } from '~/view-common.ts';
import { Column } from '../column.ts';
import { IsAlias, Table } from '../table.ts';
/**
 * This class is used to indicate a primitive param value that is used in `sql` tag.
 * It is only used on type level and is never instantiated at runtime.
 * If you see a value of this type in the code, its runtime value is actually the primitive param value.
 */
export class FakePrimitiveParam {
    static [entityKind] = 'FakePrimitiveParam';
}
export function isSQLWrapper(value) {
    return value !== null && value !== undefined && typeof value.getSQL === 'function';
}
function mergeQueries(queries) {
    const result = { sql: '', params: [] };
    for (const query of queries) {
        result.sql += query.sql;
        result.params.push(...query.params);
        if (query.typings?.length) {
            if (!result.typings) {
                result.typings = [];
            }
            result.typings.push(...query.typings);
        }
    }
    return result;
}
export class StringChunk {
    static [entityKind] = 'StringChunk';
    value;
    constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
    }
    getSQL() {
        return new SQL([this]);
    }
}
export class SQL {
    queryChunks;
    static [entityKind] = 'SQL';
    /** @internal */
    decoder = noopDecoder;
    shouldInlineParams = false;
    constructor(queryChunks) {
        this.queryChunks = queryChunks;
    }
    append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
    }
    toQuery(config) {
        return tracer.startActiveSpan('drizzle.buildSQL', (span) => {
            const query = this.buildQueryFromSourceParams(this.queryChunks, config);
            span?.setAttributes({
                'drizzle.query.text': query.sql,
                'drizzle.query.params': JSON.stringify(query.params),
            });
            return query;
        });
    }
    buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
            inlineParams: _config.inlineParams || this.shouldInlineParams,
            paramStartIndex: _config.paramStartIndex || { value: 0 },
        });
        const { casing, escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex, } = config;
        return mergeQueries(chunks.map((chunk) => {
            if (is(chunk, StringChunk)) {
                return { sql: chunk.value.join(''), params: [] };
            }
            if (is(chunk, Name)) {
                return { sql: escapeName(chunk.value), params: [] };
            }
            if (chunk === undefined) {
                return { sql: '', params: [] };
            }
            if (Array.isArray(chunk)) {
                const result = [new StringChunk('(')];
                for (const [i, p] of chunk.entries()) {
                    result.push(p);
                    if (i < chunk.length - 1) {
                        result.push(new StringChunk(', '));
                    }
                }
                result.push(new StringChunk(')'));
                return this.buildQueryFromSourceParams(result, config);
            }
            if (is(chunk, SQL)) {
                return this.buildQueryFromSourceParams(chunk.queryChunks, {
                    ...config,
                    inlineParams: inlineParams || chunk.shouldInlineParams,
                });
            }
            if (is(chunk, Table)) {
                const schemaName = chunk[Table.Symbol.Schema];
                const tableName = chunk[Table.Symbol.Name];
                return {
                    sql: schemaName === undefined || chunk[IsAlias]
                        ? escapeName(tableName)
                        : escapeName(schemaName) + '.' + escapeName(tableName),
                    params: [],
                };
            }
            if (is(chunk, Column)) {
                const columnName = casing.getColumnCasing(chunk);
                if (_config.invokeSource === 'indexes') {
                    return { sql: escapeName(columnName), params: [] };
                }
                const schemaName = chunk.table[Table.Symbol.Schema];
                return {
                    sql: chunk.table[IsAlias] || schemaName === undefined
                        ? escapeName(chunk.table[Table.Symbol.Name]) + '.' + escapeName(columnName)
                        : escapeName(schemaName) + '.' + escapeName(chunk.table[Table.Symbol.Name]) + '.'
                            + escapeName(columnName),
                    params: [],
                };
            }
            if (is(chunk, View)) {
                const schemaName = chunk[ViewBaseConfig].schema;
                const viewName = chunk[ViewBaseConfig].name;
                return {
                    sql: schemaName === undefined || chunk[ViewBaseConfig].isAlias
                        ? escapeName(viewName)
                        : escapeName(schemaName) + '.' + escapeName(viewName),
                    params: [],
                };
            }
            if (is(chunk, Param)) {
                if (is(chunk.value, Placeholder)) {
                    return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ['none'] };
                }
                const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
                if (is(mappedValue, SQL)) {
                    return this.buildQueryFromSourceParams([mappedValue], config);
                }
                if (inlineParams) {
                    return { sql: this.mapInlineParam(mappedValue, config), params: [] };
                }
                let typings = ['none'];
                if (prepareTyping) {
                    typings = [prepareTyping(chunk.encoder)];
                }
                return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
            }
            if (is(chunk, Placeholder)) {
                return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ['none'] };
            }
            if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined) {
                return { sql: escapeName(chunk.fieldAlias), params: [] };
            }
            if (is(chunk, Subquery)) {
                if (chunk._.isWith) {
                    return { sql: escapeName(chunk._.alias), params: [] };
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk('('),
                    chunk._.sql,
                    new StringChunk(') '),
                    new Name(chunk._.alias),
                ], config);
            }
            if (isPgEnum(chunk)) {
                if (chunk.schema) {
                    return { sql: escapeName(chunk.schema) + '.' + escapeName(chunk.enumName), params: [] };
                }
                return { sql: escapeName(chunk.enumName), params: [] };
            }
            if (isSQLWrapper(chunk)) {
                if (chunk.shouldOmitSQLParens?.()) {
                    return this.buildQueryFromSourceParams([chunk.getSQL()], config);
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk('('),
                    chunk.getSQL(),
                    new StringChunk(')'),
                ], config);
            }
            if (inlineParams) {
                return { sql: this.mapInlineParam(chunk, config), params: [] };
            }
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ['none'] };
        }));
    }
    mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
            return 'null';
        }
        if (typeof chunk === 'number' || typeof chunk === 'boolean') {
            return chunk.toString();
        }
        if (typeof chunk === 'string') {
            return escapeString(chunk);
        }
        if (typeof chunk === 'object') {
            const mappedValueAsString = chunk.toString();
            if (mappedValueAsString === '[object Object]') {
                return escapeString(JSON.stringify(chunk));
            }
            return escapeString(mappedValueAsString);
        }
        throw new Error('Unexpected param value: ' + chunk);
    }
    getSQL() {
        return this;
    }
    as(alias) {
        // TODO: remove with deprecated overloads
        if (alias === undefined) {
            return this;
        }
        return new SQL.Aliased(this, alias);
    }
    mapWith(decoder) {
        this.decoder = typeof decoder === 'function' ? { mapFromDriverValue: decoder } : decoder;
        return this;
    }
    inlineParams() {
        this.shouldInlineParams = true;
        return this;
    }
    /**
     * This method is used to conditionally include a part of the query.
     *
     * @param condition - Condition to check
     * @returns itself if the condition is `true`, otherwise `undefined`
     */
    if(condition) {
        return condition ? this : undefined;
    }
}
/**
 * Any DB name (table, column, index etc.)
 */
export class Name {
    value;
    static [entityKind] = 'Name';
    brand;
    constructor(value) {
        this.value = value;
    }
    getSQL() {
        return new SQL([this]);
    }
}
/**
 * Any DB name (table, column, index etc.)
 * @deprecated Use `sql.identifier` instead.
 */
export function name(value) {
    return new Name(value);
}
export function isDriverValueEncoder(value) {
    return typeof value === 'object' && value !== null && 'mapToDriverValue' in value
        && typeof value.mapToDriverValue === 'function';
}
export const noopDecoder = {
    mapFromDriverValue: (value) => value,
};
export const noopEncoder = {
    mapToDriverValue: (value) => value,
};
export const noopMapper = {
    ...noopDecoder,
    ...noopEncoder,
};
/** Parameter value that is optionally bound to an encoder (for example, a column). */
export class Param {
    value;
    encoder;
    static [entityKind] = 'Param';
    brand;
    /**
     * @param value - Parameter value
     * @param encoder - Encoder to convert the value to a driver parameter
     */
    constructor(value, encoder = noopEncoder) {
        this.value = value;
        this.encoder = encoder;
    }
    getSQL() {
        return new SQL([this]);
    }
}
/** @deprecated Use `sql.param` instead. */
export function param(value, encoder) {
    return new Param(value, encoder);
}
/*
    The type of `params` is specified as `SQLChunk[]`, but that's slightly incorrect -
    in runtime, users won't pass `FakePrimitiveParam` instances as `params` - they will pass primitive values
    which will be wrapped in `Param`. That's why the overload specifies `params` as `any[]` and not as `SQLSourceParam[]`.
    This type is used to make our lives easier and the type checker happy.
*/
export function sql(strings, ...params) {
    const queryChunks = [];
    if (params.length > 0 || (strings.length > 0 && strings[0] !== '')) {
        queryChunks.push(new StringChunk(strings[0]));
    }
    for (const [paramIndex, param] of params.entries()) {
        queryChunks.push(param, new StringChunk(strings[paramIndex + 1]));
    }
    return new SQL(queryChunks);
}
(function (sql) {
    function empty() {
        return new SQL([]);
    }
    sql.empty = empty;
    /** @deprecated - use `sql.join()` */
    function fromList(list) {
        return new SQL(list);
    }
    sql.fromList = fromList;
    /**
     * Convenience function to create an SQL query from a raw string.
     * @param str The raw SQL query string.
     */
    function raw(str) {
        return new SQL([new StringChunk(str)]);
    }
    sql.raw = raw;
    /**
     * Join a list of SQL chunks with a separator.
     * @example
     * ```ts
     * const query = sql.join([sql`a`, sql`b`, sql`c`]);
     * // sql`abc`
     * ```
     * @example
     * ```ts
     * const query = sql.join([sql`a`, sql`b`, sql`c`], sql`, `);
     * // sql`a, b, c`
     * ```
     */
    function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
            if (i > 0 && separator !== undefined) {
                result.push(separator);
            }
            result.push(chunk);
        }
        return new SQL(result);
    }
    sql.join = join;
    /**
     * Create a SQL chunk that represents a DB identifier (table, column, index etc.).
     * When used in a query, the identifier will be escaped based on the DB engine.
     * For example, in PostgreSQL, identifiers are escaped with double quotes.
     *
     * **WARNING: This function does not offer any protection against SQL injections, so you must validate any user input beforehand.**
     *
     * @example ```ts
     * const query = sql`SELECT * FROM ${sql.identifier('my-table')}`;
     * // 'SELECT * FROM "my-table"'
     * ```
     */
    function identifier(value) {
        return new Name(value);
    }
    sql.identifier = identifier;
    function placeholder(name) {
        return new Placeholder(name);
    }
    sql.placeholder = placeholder;
    function param(value, encoder) {
        return new Param(value, encoder);
    }
    sql.param = param;
})(sql || (sql = {}));
(function (SQL) {
    class Aliased {
        sql;
        fieldAlias;
        static [entityKind] = 'SQL.Aliased';
        /** @internal */
        isSelectionField = false;
        constructor(sql, fieldAlias) {
            this.sql = sql;
            this.fieldAlias = fieldAlias;
        }
        getSQL() {
            return this.sql;
        }
        /** @internal */
        clone() {
            return new Aliased(this.sql, this.fieldAlias);
        }
    }
    SQL.Aliased = Aliased;
})(SQL || (SQL = {}));
export class Placeholder {
    name;
    static [entityKind] = 'Placeholder';
    constructor(name) {
        this.name = name;
    }
    getSQL() {
        return new SQL([this]);
    }
}
/** @deprecated Use `sql.placeholder` instead. */
export function placeholder(name) {
    return new Placeholder(name);
}
export function fillPlaceholders(params, values) {
    return params.map((p) => {
        if (is(p, Placeholder)) {
            if (!(p.name in values)) {
                throw new Error(`No value for placeholder "${p.name}" was provided`);
            }
            return values[p.name];
        }
        if (is(p, Param) && is(p.value, Placeholder)) {
            if (!(p.value.name in values)) {
                throw new Error(`No value for placeholder "${p.value.name}" was provided`);
            }
            return p.encoder.mapToDriverValue(values[p.value.name]);
        }
        return p;
    });
}
const IsDrizzleView = Symbol.for('drizzle:IsDrizzleView');
export class View {
    static [entityKind] = 'View';
    /** @internal */
    [ViewBaseConfig];
    /** @internal */
    [IsDrizzleView] = true;
    constructor({ name, schema, selectedFields, query }) {
        this[ViewBaseConfig] = {
            name,
            originalName: name,
            schema,
            selectedFields,
            query: query,
            isExisting: !query,
            isAlias: false,
        };
    }
    getSQL() {
        return new SQL([this]);
    }
}
export function isView(view) {
    return typeof view === 'object' && view !== null && IsDrizzleView in view;
}
export function getViewName(view) {
    return view[ViewBaseConfig].name;
}
// Defined separately from the Column class to resolve circular dependency
Column.prototype.getSQL = function () {
    return new SQL([this]);
};
// Defined separately from the Table class to resolve circular dependency
Table.prototype.getSQL = function () {
    return new SQL([this]);
};
// Defined separately from the Column class to resolve circular dependency
Subquery.prototype.getSQL = function () {
    return new SQL([this]);
};
//# sourceMappingURL=sql.js.map