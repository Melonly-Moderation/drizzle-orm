import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgRealBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgRealBuilder';
    constructor(name, length) {
        super(name, 'number', 'PgReal');
        this.config.length = length;
    }
    /** @internal */
    build(table) {
        return new PgReal(table, this.config);
    }
}
export class PgReal extends PgColumn {
    static [entityKind] = 'PgReal';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return 'real';
    }
    mapFromDriverValue = (value) => {
        if (typeof value === 'string') {
            return Number.parseFloat(value);
        }
        return value;
    };
}
export function real(name) {
    return new PgRealBuilder(name ?? '');
}
//# sourceMappingURL=real.js.map