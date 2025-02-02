import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from '../common.ts';
export class PgVectorBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgVectorBuilder';
    constructor(name, config) {
        super(name, 'array', 'PgVector');
        this.config.dimensions = config.dimensions;
    }
    /** @internal */
    build(table) {
        return new PgVector(table, this.config);
    }
}
export class PgVector extends PgColumn {
    static [entityKind] = 'PgVector';
    dimensions = this.config.dimensions;
    getSQLType() {
        return `vector(${this.dimensions})`;
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
export function vector(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgVectorBuilder(name, config);
}
//# sourceMappingURL=vector.js.map