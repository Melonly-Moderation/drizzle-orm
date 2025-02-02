import { entityKind } from '~/entity.ts';
export class IndexBuilderOn {
    name;
    unique;
    static [entityKind] = 'SQLiteIndexBuilderOn';
    constructor(name, unique) {
        this.name = name;
        this.unique = unique;
    }
    on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
    }
}
export class IndexBuilder {
    static [entityKind] = 'SQLiteIndexBuilder';
    /** @internal */
    config;
    constructor(name, columns, unique) {
        this.config = {
            name,
            columns,
            unique,
            where: undefined,
        };
    }
    /**
     * Condition for partial index.
     */
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
    static [entityKind] = 'SQLiteIndex';
    config;
    constructor(config, table) {
        this.config = { ...config, table };
    }
}
export function index(name) {
    return new IndexBuilderOn(name, false);
}
export function uniqueIndex(name) {
    return new IndexBuilderOn(name, true);
}
//# sourceMappingURL=indexes.js.map