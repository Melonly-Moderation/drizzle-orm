import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from '../common.ts';
import { parseEWKB } from './utils.ts';
export class PgGeometryBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgGeometryBuilder';
    constructor(name) {
        super(name, 'array', 'PgGeometry');
    }
    /** @internal */
    build(table) {
        return new PgGeometry(table, this.config);
    }
}
export class PgGeometry extends PgColumn {
    static [entityKind] = 'PgGeometry';
    getSQLType() {
        return 'geometry(point)';
    }
    mapFromDriverValue(value) {
        return parseEWKB(value);
    }
    mapToDriverValue(value) {
        return `point(${value[0]} ${value[1]})`;
    }
}
export class PgGeometryObjectBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgGeometryObjectBuilder';
    constructor(name) {
        super(name, 'json', 'PgGeometryObject');
    }
    /** @internal */
    build(table) {
        return new PgGeometryObject(table, this.config);
    }
}
export class PgGeometryObject extends PgColumn {
    static [entityKind] = 'PgGeometryObject';
    getSQLType() {
        return 'geometry(point)';
    }
    mapFromDriverValue(value) {
        const parsed = parseEWKB(value);
        return { x: parsed[0], y: parsed[1] };
    }
    mapToDriverValue(value) {
        return `point(${value.x} ${value.y})`;
    }
}
export function geometry(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (!config?.mode || config.mode === 'tuple') {
        return new PgGeometryBuilder(name);
    }
    return new PgGeometryObjectBuilder(name);
}
//# sourceMappingURL=geometry.js.map