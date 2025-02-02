import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlEnumColumnBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlEnumColumnBuilder';
    constructor(name, values) {
        super(name, 'string', 'MySqlEnumColumn');
        this.config.enumValues = values;
    }
    /** @internal */
    build(table) {
        return new MySqlEnumColumn(table, this.config);
    }
}
export class MySqlEnumColumn extends MySqlColumn {
    static [entityKind] = 'MySqlEnumColumn';
    enumValues = this.config.enumValues;
    getSQLType() {
        return `enum(${this.enumValues.map((value) => `'${value}'`).join(',')})`;
    }
}
export function mysqlEnum(a, b) {
    const { name, config: values } = getColumnNameAndConfig(a, b);
    if (values.length === 0) {
        throw new Error(`You have an empty array for "${name}" enum values`);
    }
    return new MySqlEnumColumnBuilder(name, values);
}
//# sourceMappingURL=enum.js.map