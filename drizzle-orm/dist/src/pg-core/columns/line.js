import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgLineBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgLineBuilder';
    constructor(name) {
        super(name, 'array', 'PgLine');
    }
    /** @internal */
    build(table) {
        return new PgLineTuple(table, this.config);
    }
}
export class PgLineTuple extends PgColumn {
    static [entityKind] = 'PgLine';
    getSQLType() {
        return 'line';
    }
    mapFromDriverValue(value) {
        const [a, b, c] = value.slice(1, -1).split(',');
        return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
    }
    mapToDriverValue(value) {
        return `{${value[0]},${value[1]},${value[2]}}`;
    }
}
export class PgLineABCBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgLineABCBuilder';
    constructor(name) {
        super(name, 'json', 'PgLineABC');
    }
    /** @internal */
    build(table) {
        return new PgLineABC(table, this.config);
    }
}
export class PgLineABC extends PgColumn {
    static [entityKind] = 'PgLineABC';
    getSQLType() {
        return 'line';
    }
    mapFromDriverValue(value) {
        const [a, b, c] = value.slice(1, -1).split(',');
        return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
    }
    mapToDriverValue(value) {
        return `{${value.a},${value.b},${value.c}}`;
    }
}
export function line(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (!config?.mode || config.mode === 'tuple') {
        return new PgLineBuilder(name);
    }
    return new PgLineABCBuilder(name);
}
//# sourceMappingURL=line.js.map