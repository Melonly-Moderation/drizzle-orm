import { entityKind } from '~/entity.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
const isPgEnumSym = Symbol.for('drizzle:isPgEnum');
export function isPgEnum(obj) {
    return !!obj && typeof obj === 'function' && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
export class PgEnumColumnBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgEnumColumnBuilder';
    constructor(name, enumInstance) {
        super(name, 'string', 'PgEnumColumn');
        this.config.enum = enumInstance;
    }
    /** @internal */
    build(table) {
        return new PgEnumColumn(table, this.config);
    }
}
export class PgEnumColumn extends PgColumn {
    static [entityKind] = 'PgEnumColumn';
    enum = this.config.enum;
    enumValues = this.config.enum.enumValues;
    constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
    }
    getSQLType() {
        return this.enum.enumName;
    }
}
// Gratitude to zod for the enum function types
export function pgEnum(enumName, values) {
    return pgEnumWithSchema(enumName, values, undefined);
}
/** @internal */
export function pgEnumWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name) => new PgEnumColumnBuilder(name ?? '', enumInstance), {
        enumName,
        enumValues: values,
        schema,
        [isPgEnumSym]: true,
    });
    return enumInstance;
}
//# sourceMappingURL=enum.js.map