import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SQLiteColumn, SQLiteColumnBuilder } from './common.ts';
export class SQLiteCustomColumnBuilder extends SQLiteColumnBuilder {
    static [entityKind] = 'SQLiteCustomColumnBuilder';
    constructor(name, fieldConfig, customTypeParams) {
        super(name, 'custom', 'SQLiteCustomColumn');
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
    }
    /** @internal */
    build(table) {
        return new SQLiteCustomColumn(table, this.config);
    }
}
export class SQLiteCustomColumn extends SQLiteColumn {
    static [entityKind] = 'SQLiteCustomColumn';
    sqlName;
    mapTo;
    mapFrom;
    constructor(table, config) {
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
    }
    getSQLType() {
        return this.sqlName;
    }
    mapFromDriverValue(value) {
        return typeof this.mapFrom === 'function' ? this.mapFrom(value) : value;
    }
    mapToDriverValue(value) {
        return typeof this.mapTo === 'function' ? this.mapTo(value) : value;
    }
}
/**
 * Custom sqlite database data type generator
 */
export function customType(customTypeParams) {
    return (a, b) => {
        const { name, config } = getColumnNameAndConfig(a, b);
        return new SQLiteCustomColumnBuilder(name, config, customTypeParams);
    };
}
//# sourceMappingURL=custom.js.map