import { entityKind } from '~/entity.ts';
export class IndexBuilderOn {
    name;
    unique;
    static [entityKind] = 'MySqlIndexBuilderOn';
    constructor(name, unique) {
        this.name = name;
        this.unique = unique;
    }
    on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
    }
}
export class IndexBuilder {
    static [entityKind] = 'MySqlIndexBuilder';
    /** @internal */
    config;
    constructor(name, columns, unique) {
        this.config = {
            name,
            columns,
            unique,
        };
    }
    using(using) {
        this.config.using = using;
        return this;
    }
    algorythm(algorythm) {
        this.config.algorythm = algorythm;
        return this;
    }
    lock(lock) {
        this.config.lock = lock;
        return this;
    }
    /** @internal */
    build(table) {
        return new Index(this.config, table);
    }
}
export class Index {
    static [entityKind] = 'MySqlIndex';
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