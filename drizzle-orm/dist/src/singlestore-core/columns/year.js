import { entityKind } from '~/entity.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreYearBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreYearBuilder';
    constructor(name) {
        super(name, 'number', 'SingleStoreYear');
    }
    /** @internal */
    build(table) {
        return new SingleStoreYear(table, this.config);
    }
}
export class SingleStoreYear extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreYear';
    getSQLType() {
        return `year`;
    }
}
export function year(name) {
    return new SingleStoreYearBuilder(name ?? '');
}
//# sourceMappingURL=year.js.map