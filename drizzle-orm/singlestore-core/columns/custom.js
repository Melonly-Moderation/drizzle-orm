import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreCustomColumnBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreCustomColumnBuilder';
    constructor(name, fieldConfig, customTypeParams) {
        super(name, 'custom', 'SingleStoreCustomColumn');
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
    }
    /** @internal */
    build(table) {
        return new SingleStoreCustomColumn(table, this.config);
    }
}
export class SingleStoreCustomColumn extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreCustomColumn';
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
 * Custom singlestore database data type generator
 */
export function customType(customTypeParams) {
    return (a, b) => {
        const { name, config } = getColumnNameAndConfig(a, b);
        return new SingleStoreCustomColumnBuilder(name, config, customTypeParams);
    };
}
//# sourceMappingURL=custom.js.map