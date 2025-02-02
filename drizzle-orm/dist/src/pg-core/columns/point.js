import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgPointTupleBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgPointTupleBuilder';
    constructor(name) {
        super(name, 'array', 'PgPointTuple');
    }
    /** @internal */
    build(table) {
        return new PgPointTuple(table, this.config);
    }
}
export class PgPointTuple extends PgColumn {
    static [entityKind] = 'PgPointTuple';
    getSQLType() {
        return 'point';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            const [x, y] = value.slice(1, -1).split(',');
            return [Number.parseFloat(x), Number.parseFloat(y)];
        }
        return [value.x, value.y];
    }
    mapToDriverValue(value) {
        return `(${value[0]},${value[1]})`;
    }
}
export class PgPointObjectBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgPointObjectBuilder';
    constructor(name) {
        super(name, 'json', 'PgPointObject');
    }
    /** @internal */
    build(table) {
        return new PgPointObject(table, this.config);
    }
}
export class PgPointObject extends PgColumn {
    static [entityKind] = 'PgPointObject';
    getSQLType() {
        return 'point';
    }
    mapFromDriverValue(value) {
        if (typeof value === 'string') {
            const [x, y] = value.slice(1, -1).split(',');
            return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
        }
        return value;
    }
    mapToDriverValue(value) {
        return `(${value.x},${value.y})`;
    }
}
export function point(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (!config?.mode || config.mode === 'tuple') {
        return new PgPointTupleBuilder(name);
    }
    return new PgPointObjectBuilder(name);
}
//# sourceMappingURL=point.js.map