import { entityKind } from '~/entity.ts';
import { MySqlColumnBuilderWithAutoIncrement, MySqlColumnWithAutoIncrement } from './common.ts';
export class MySqlSerialBuilder extends MySqlColumnBuilderWithAutoIncrement {
    static [entityKind] = 'MySqlSerialBuilder';
    constructor(name) {
        super(name, 'number', 'MySqlSerial');
        this.config.hasDefault = true;
        this.config.autoIncrement = true;
    }
    /** @internal */
    build(table) {
        return new MySqlSerial(table, this.config);
    }
}
export class MySqlSerial extends MySqlColumnWithAutoIncrement {
    static [entityKind] = 'MySqlSerial';
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
    return new MySqlSerialBuilder(name ?? '');
}
//# sourceMappingURL=serial.js.map