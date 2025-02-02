import { entityKind } from '~/entity.ts';
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from './common.ts';
export class SingleStoreSerialBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
    static [entityKind] = 'SingleStoreSerialBuilder';
    constructor(name) {
        super(name, 'number', 'SingleStoreSerial');
        this.config.hasDefault = true;
        this.config.autoIncrement = true;
    }
    /** @internal */
    build(table) {
        return new SingleStoreSerial(table, this.config);
    }
}
export class SingleStoreSerial extends SingleStoreColumnWithAutoIncrement {
    static [entityKind] = 'SingleStoreSerial';
    getSQLType() {
        return 'serial';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            return Number(value);
        }
        return value;
    }
}
export function serial(name) {
    return new SingleStoreSerialBuilder(name ?? '');
}
//# sourceMappingURL=serial.js.map