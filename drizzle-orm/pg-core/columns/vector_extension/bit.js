import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from '../common.ts';
export class PgBinaryVectorBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgBinaryVectorBuilder';
    constructor(name, config) {
        super(name, 'string', 'PgBinaryVector');
        this.config.dimensions = config.dimensions;
    }
    /** @internal */
    build(table) {
        return new PgBinaryVector(table, this.config);
    }
}
export class PgBinaryVector extends PgColumn {
    static [entityKind] = 'PgBinaryVector';
    dimensions = this.config.dimensions;
    getSQLType() {
        return `bit(${this.dimensions})`;
    }
}
export function bit(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgBinaryVectorBuilder(name, config);
}
//# sourceMappingURL=bit.js.map