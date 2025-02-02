import { entityKind } from '~/entity.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreTimeBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreTimeBuilder';
    constructor(name) {
        super(name, 'string', 'SingleStoreTime');
    }
    /** @internal */
    build(table) {
        return new SingleStoreTime(table, this.config);
    }
}
export class SingleStoreTime extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreTime';
    getSQLType() {
        return `time`;
    }
}
export function time(name) {
    return new SingleStoreTimeBuilder(name ?? '');
}
//# sourceMappingURL=time.js.map