import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from '../common.ts';
export class PgHalfVectorBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgHalfVectorBuilder';
    constructor(name, config) {
        super(name, 'array', 'PgHalfVector');
        this.config.dimensions = config.dimensions;
    }
    /** @internal */
    build(table) {
        return new PgHalfVector(table, this.config);
    }
}
export class PgHalfVector extends PgColumn {
    static [entityKind] = 'PgHalfVector';
    dimensions = this.config.dimensions;
    getSQLType() {
        return `halfvec(${this.dimensions})`;
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
    mapFromDriverValue(value) {
        return value
            .slice(1, -1)
            .split(',')
            .map((v) => Number.parseFloat(v));
    }
}
export function halfvec(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgHalfVectorBuilder(name, config);
}
//# sourceMappingURL=halfvec.js.map