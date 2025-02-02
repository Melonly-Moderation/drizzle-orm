import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgSerialBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgSerialBuilder';
    constructor(name) {
        super(name, 'number', 'PgSerial');
        this.config.hasDefault = true;
        this.config.notNull = true;
    }
    /** @internal */
    build(table) {
        return new PgSerial(table, this.config);
    }
}
export class PgSerial extends PgColumn {
    static [entityKind] = 'PgSerial';
    getSQLType() {
        return 'serial';
    }
}
export function serial(name) {
    return new PgSerialBuilder(name ?? '');
}
//# sourceMappingURL=serial.js.map