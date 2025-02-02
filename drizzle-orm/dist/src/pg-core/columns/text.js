import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgTextBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgTextBuilder';
    constructor(name, config) {
        super(name, 'string', 'PgText');
        this.config.enumValues = config.enum;
    }
    /** @internal */
    build(table) {
        return new PgText(table, this.config);
    }
}
export class PgText extends PgColumn {
    static [entityKind] = 'PgText';
    enumValues = this.config.enumValues;
    getSQLType() {
        return 'text';
    }
}
export function text(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new PgTextBuilder(name, config);
}
//# sourceMappingURL=text.js.map