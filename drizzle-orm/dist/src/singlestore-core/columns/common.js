import { ColumnBuilder } from '~/column-builder.ts';
import { Column } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { uniqueKeyName } from '../unique-constraint.ts';
export class SingleStoreColumnBuilder extends ColumnBuilder {
    static [entityKind] = 'SingleStoreColumnBuilder';
    unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
    }
    // TODO: Implement generated columns for SingleStore (https://docs.singlestore.com/cloud/create-a-database/using-persistent-computed-columns/)
    /** @internal */
    generatedAlwaysAs(as, config) {
        this.config.generated = {
            as,
            type: 'always',
            mode: config?.mode ?? 'virtual',
        };
        return this;
    }
}
// To understand how to use `SingleStoreColumn` and `AnySingleStoreColumn`, see `Column` and `AnyColumn` documentation.
export class SingleStoreColumn extends Column {
    table;
    static [entityKind] = 'SingleStoreColumn';
    constructor(table, config) {
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
    }
}
export class SingleStoreColumnBuilderWithAutoIncrement extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreColumnBuilderWithAutoIncrement';
    constructor(name, dataType, columnType) {
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
    }
    autoincrement() {
        this.config.autoIncrement = true;
        this.config.hasDefault = true;
        return this;
    }
}
export class SingleStoreColumnWithAutoIncrement extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreColumnWithAutoIncrement';
    autoIncrement = this.config.autoIncrement;
}
//# sourceMappingURL=common.js.map