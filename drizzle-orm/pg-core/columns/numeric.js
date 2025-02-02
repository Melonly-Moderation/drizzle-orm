import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgNumericBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgNumericBuilder';
    constructor(name, precision, scale) {
        super(name, 'string', 'PgNumeric');
        this.config.precision = precision;
        this.config.scale = scale;
    }
    /** @internal */
    build(table) {
        return new PgNumeric(table, this.config);
    }
}
export class PgNumeric extends PgColumn {
    static [entityKind] = 'PgNumeric';
    precision;
    scale;
    constructor(table, config) {
        super(table, config);
        this.precision = config.precision;
        this.scale = config.scale;
    }
    getSQLType() {
        if (this.precision !== undefined && this.scale !== undefined) {
            return `numeric(${this.precision}, ${this.scale})`;
        }
        else if (this.precision === undefined) {
            return 'numeric';
        }
        else {
            return `numeric(${this.precision})`;
        }
    }
}
export function numeric(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgNumericBuilder(name, config?.precision, config?.scale);
}
export const decimal = numeric;
//# sourceMappingURL=numeric.js.map