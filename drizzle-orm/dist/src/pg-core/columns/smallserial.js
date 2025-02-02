import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgSmallSerialBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgSmallSerialBuilder';
    constructor(name) {
        super(name, 'number', 'PgSmallSerial');
        this.config.hasDefault = true;
        this.config.notNull = true;
    }
    /** @internal */
    build(table) {
        return new PgSmallSerial(table, this.config);
    }
}
export class PgSmallSerial extends PgColumn {
    static [entityKind] = 'PgSmallSerial';
    getSQLType() {
        return 'smallserial';
    }
}
export function smallserial(name) {
    return new PgSmallSerialBuilder(name ?? '');
}
//# sourceMappingURL=smallserial.js.map