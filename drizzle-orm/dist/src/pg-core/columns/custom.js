import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn, PgColumnBuilder } from './common.ts';
export class PgCustomColumnBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgCustomColumnBuilder';
    constructor(name, fieldConfig, customTypeParams) {
        super(name, 'custom', 'PgCustomColumn');
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
    }
    /** @internal */
    build(table) {
        return new PgCustomColumn(table, this.config);
    }
}
export class PgCustomColumn extends PgColumn {
    static [entityKind] = 'PgCustomColumn';
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
 * Custom pg database data type generator
 */
export function customType(customTypeParams) {
    return (a, b) => {
        const { name, config } = getColumnNameAndConfig(a, b);
        return new PgCustomColumnBuilder(name, config, customTypeParams);
    };
}
//# sourceMappingURL=custom.js.map