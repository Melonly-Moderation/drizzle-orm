import { entityKind } from '~/entity.ts';
export class IndexBuilderOn {
    name;
    unique;
    static [entityKind] = 'SingleStoreIndexBuilderOn';
    constructor(name, unique) {
        this.name = name;
        this.unique = unique;
    }
    on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
    }
}
export class IndexBuilder {
    static [entityKind] = 'SingleStoreIndexBuilder';
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
    static [entityKind] = 'SingleStoreIndex';
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
/* export interface AnyFullTextIndexBuilder {
    build(table: SingleStoreTable): FullTextIndex;
} */
/*
interface FullTextIndexConfig {
    version?: number;
}

interface FullTextIndexFullConfig extends FullTextIndexConfig {
    columns: IndexColumn[];

    name: string;
}

export class FullTextIndexBuilderOn {
    static readonly [entityKind]: string = 'SingleStoreFullTextIndexBuilderOn';

    constructor(private name: string, private config: FullTextIndexConfig) {}

    on(...columns: [IndexColumn, ...IndexColumn[]]): FullTextIndexBuilder {
        return new FullTextIndexBuilder({
            name: this.name,
            columns: columns,
            ...this.config,
        });
    }
} */
/*
export interface FullTextIndexBuilder extends AnyFullTextIndexBuilder {}

export class FullTextIndexBuilder implements AnyFullTextIndexBuilder {
    static readonly [entityKind]: string = 'SingleStoreFullTextIndexBuilder'; */
/** @internal */
/* config: FullTextIndexFullConfig;

    constructor(config: FullTextIndexFullConfig) {
        this.config = config;
    } */
/** @internal */
/* build(table: SingleStoreTable): FullTextIndex {
        return new FullTextIndex(this.config, table);
    }
}

export class FullTextIndex {
    static readonly [entityKind]: string = 'SingleStoreFullTextIndex';

    readonly config: FullTextIndexConfig & { table: SingleStoreTable };

    constructor(config: FullTextIndexConfig, table: SingleStoreTable) {
        this.config = { ...config, table };
    }
}

export function fulltext(name: string, config: FullTextIndexConfig): FullTextIndexBuilderOn {
    return new FullTextIndexBuilderOn(name, config);
}

export type SortKeyColumn = SingleStoreColumn | SQL;

export class SortKeyBuilder {
    static readonly [entityKind]: string = 'SingleStoreSortKeyBuilder';

    constructor(private columns: SortKeyColumn[]) {} */
/** @internal */
/* build(table: SingleStoreTable): SortKey {
        return new SortKey(this.columns, table);
    }
}

export class SortKey {
    static readonly [entityKind]: string = 'SingleStoreSortKey';

    constructor(public columns: SortKeyColumn[], public table: SingleStoreTable) {}
}

export function sortKey(...columns: SortKeyColumn[]): SortKeyBuilder {
    return new SortKeyBuilder(columns);
}
 */
//# sourceMappingURL=indexes.js.map