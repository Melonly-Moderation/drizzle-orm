import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from '../common.ts';
export class PgSparseVectorBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgSparseVectorBuilder';
    constructor(name, config) {
        super(name, 'string', 'PgSparseVector');
        this.config.dimensions = config.dimensions;
    }
    /** @internal */
    build(table) {
        return new PgSparseVector(table, this.config);
    }
}
export class PgSparseVector extends PgColumn {
    static [entityKind] = 'PgSparseVector';
    dimensions = this.config.dimensions;
    getSQLType() {
        return `sparsevec(${this.dimensions})`;
    }
}
export function sparsevec(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgSparseVectorBuilder(name, config);
}
//# sourceMappingURL=sparsevec.js.map