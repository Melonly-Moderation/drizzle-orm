import { entityKind } from '~/entity.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreJsonBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreJsonBuilder';
    constructor(name) {
        super(name, 'json', 'SingleStoreJson');
    }
    /** @internal */
    build(table) {
        return new SingleStoreJson(table, this.config);
    }
}
export class SingleStoreJson extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreJson';
    getSQLType() {
        return 'json';
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
}
export function json(name) {
    return new SingleStoreJsonBuilder(name ?? '');
}
//# sourceMappingURL=json.js.map