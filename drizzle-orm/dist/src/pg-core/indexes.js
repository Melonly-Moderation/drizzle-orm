import { SQL } from '~/sql/sql.ts';
import { entityKind, is } from '~/entity.ts';
import { IndexedColumn } from './columns/index.ts';
export class IndexBuilderOn {
    unique;
    name;
    static [entityKind] = 'PgIndexBuilderOn';
    constructor(unique, name) {
        this.unique = unique;
        this.name = name;
    }
    on(...columns) {
        return new IndexBuilder(columns.map((it) => {
            if (is(it, SQL)) {
                return it;
            }
            it = it;
            const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
            it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
            return clonedIndexedColumn;
        }), this.unique, false, this.name);
    }
    onOnly(...columns) {
        return new IndexBuilder(columns.map((it) => {
            if (is(it, SQL)) {
                return it;
            }
            it = it;
            const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
            it.indexConfig = it.defaultConfig;
            return clonedIndexedColumn;
        }), this.unique, true, this.name);
    }
    /**
     * Specify what index method to use. Choices are `btree`, `hash`, `gist`, `spgist`, `gin`, `brin`, or user-installed access methods like `bloom`. The default method is `btree.
     *
     * If you have the `pg_vector` extension installed in your database, you can use the `hnsw` and `ivfflat` options, which are predefined types.
     *
     * **You can always specify any string you want in the method, in case Drizzle doesn't have it natively in its types**
     *
     * @param method The name of the index method to be used
     * @param columns
     * @returns
     */
    using(method, ...columns) {
        return new IndexBuilder(columns.map((it) => {
            if (is(it, SQL)) {
                return it;
            }
            it = it;
            const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
            it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
            return clonedIndexedColumn;
        }), this.unique, true, this.name, method);
    }
}
export class IndexBuilder {
    static [entityKind] = 'PgIndexBuilder';
    /** @internal */
    config;
    constructor(columns, unique, only, name, method = 'btree') {
        this.config = {
            name,
            columns,
            unique,
            only,
            method,
        };
    }
    concurrently() {
        this.config.concurrently = true;
        return this;
    }
    with(obj) {
        this.config.with = obj;
        return this;
    }
    where(condition) {
        this.config.where = condition;
        return this;
    }
    /** @internal */
    build(table) {
        return new Index(this.config, table);
    }
}
export class Index {
    static [entityKind] = 'PgIndex';
    config;
    constructor(config, table) {
        this.config = { ...config, table };
    }
}
export function index(name) {
    return new IndexBuilderOn(false, name);
}
export function uniqueIndex(name) {
    return new IndexBuilderOn(true, name);
}
//# sourceMappingURL=indexes.js.map