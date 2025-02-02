import { entityKind } from '~/entity.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreBooleanBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreBooleanBuilder';
    constructor(name) {
        super(name, 'boolean', 'SingleStoreBoolean');
    }
    /** @internal */
    build(table) {
        return new SingleStoreBoolean(table, this.config);
    }
}
export class SingleStoreBoolean extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreBoolean';
    getSQLType() {
        return 'boolean';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        return value === 1;
    }
}
export function boolean(name) {
    return new SingleStoreBooleanBuilder(name ?? '');
}
//# sourceMappingURL=boolean.js.map