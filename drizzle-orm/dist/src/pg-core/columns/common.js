import { ColumnBuilder } from '~/column-builder.ts';
import { Column } from '~/column.ts';
import { entityKind, is } from '~/entity.ts';
import { ForeignKeyBuilder } from '~/pg-core/foreign-keys.ts';
import { iife } from '~/tracing-utils.ts';
import { uniqueKeyName } from '../unique-constraint.ts';
import { makePgArray, parsePgArray } from '../utils/array.ts';
export class PgColumnBuilder extends ColumnBuilder {
    foreignKeyConfigs = [];
    static [entityKind] = 'PgColumnBuilder';
    array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
    }
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
    }
    unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
    }
    generatedAlwaysAs(as) {
        this.config.generated = {
            as,
            type: 'always',
            mode: 'stored',
        };
        return this;
    }
    /** @internal */
    buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
            return iife((ref, actions) => {
                const builder = new ForeignKeyBuilder(() => {
                    const foreignColumn = ref();
                    return { columns: [column], foreignColumns: [foreignColumn] };
                });
                if (actions.onUpdate) {
                    builder.onUpdate(actions.onUpdate);
                }
                if (actions.onDelete) {
                    builder.onDelete(actions.onDelete);
                }
                return builder.build(table);
            }, ref, actions);
        });
    }
    /** @internal */
    buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
    }
}
// To understand how to use `PgColumn` and `PgColumn`, see `Column` and `AnyColumn` documentation.
export class PgColumn extends Column {
    table;
    static [entityKind] = 'PgColumn';
    constructor(table, config) {
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
    }
}
export class ExtraConfigColumn extends PgColumn {
    static [entityKind] = 'ExtraConfigColumn';
    getSQLType() {
        return this.getSQLType();
    }
    indexConfig = {
        order: this.config.order ?? 'asc',
        nulls: this.config.nulls ?? 'last',
        opClass: this.config.opClass,
    };
    defaultConfig = {
        order: 'asc',
        nulls: 'last',
        opClass: undefined,
    };
    asc() {
        this.indexConfig.order = 'asc';
        return this;
    }
    desc() {
        this.indexConfig.order = 'desc';
        return this;
    }
    nullsFirst() {
        this.indexConfig.nulls = 'first';
        return this;
    }
    nullsLast() {
        this.indexConfig.nulls = 'last';
        return this;
    }
    /**
     * ### PostgreSQL documentation quote
     *
     * > An operator class with optional parameters can be specified for each column of an index.
     * The operator class identifies the operators to be used by the index for that column.
     * For example, a B-tree index on four-byte integers would use the int4_ops class;
     * this operator class includes comparison functions for four-byte integers.
     * In practice the default operator class for the column's data type is usually sufficient.
     * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
     * For example, we might want to sort a complex-number data type either by absolute value or by real part.
     * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
     * More information about operator classes check:
     *
     * ### Useful links
     * https://www.postgresql.org/docs/current/sql-createindex.html
     *
     * https://www.postgresql.org/docs/current/indexes-opclass.html
     *
     * https://www.postgresql.org/docs/current/xindex.html
     *
     * ### Additional types
     * If you have the `pg_vector` extension installed in your database, you can use the
     * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
     *
     * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
     *
     * @param opClass
     * @returns
     */
    op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
    }
}
export class IndexedColumn {
    static [entityKind] = 'IndexedColumn';
    constructor(name, keyAsName, type, indexConfig) {
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
    }
    name;
    keyAsName;
    type;
    indexConfig;
}
export class PgArrayBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgArrayBuilder';
    constructor(name, baseBuilder, size) {
        super(name, 'array', 'PgArray');
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
    }
    /** @internal */
    build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(table, this.config, baseColumn);
    }
}
export class PgArray extends PgColumn {
    baseColumn;
    range;
    size;
    static [entityKind] = 'PgArray';
    constructor(table, config, baseColumn, range) {
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
    }
    getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === 'number' ? this.size : ''}]`;
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            // Thank you node-postgres for not parsing enum arrays
            value = parsePgArray(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
    }
    mapToDriverValue(value, isNestedArray = false) {
        const a = value.map((v) => v === null
            ? null
            : is(this.baseColumn, PgArray)
                ? this.baseColumn.mapToDriverValue(v, true)
                : this.baseColumn.mapToDriverValue(v));
        if (isNestedArray)
            return a;
        return makePgArray(a);
    }
}
//# sourceMappingURL=common.js.map