import { ColumnBuilder } from '~/column-builder.ts';
import { Column } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { ForeignKeyBuilder } from '~/mysql-core/foreign-keys.ts';
import { uniqueKeyName } from '../unique-constraint.ts';
export class MySqlColumnBuilder extends ColumnBuilder {
    static [entityKind] = 'MySqlColumnBuilder';
    foreignKeyConfigs = [];
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
    }
    unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
    }
    generatedAlwaysAs(as, config) {
        this.config.generated = {
            as,
            type: 'always',
            mode: config?.mode ?? 'virtual',
        };
        return this;
    }
    /** @internal */
    buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
            return ((ref, actions) => {
                const builder = new ForeignKeyBuilder(() => {
                    const foreignColumn = ref();
                    return { columns: [column], foreignColumns: [foreignColumn] };
                });
                if (actions.onUpdate) {
                    builder.onUpdate(actions.onUpdate);
                }
                if (actions.onDelete) {
                    builder.onDelete(actions.onDelete);
                }
                return builder.build(table);
            })(ref, actions);
        });
    }
}
// To understand how to use `MySqlColumn` and `AnyMySqlColumn`, see `Column` and `AnyColumn` documentation.
export class MySqlColumn extends Column {
    table;
    static [entityKind] = 'MySqlColumn';
    constructor(table, config) {
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
    }
}
export class MySqlColumnBuilderWithAutoIncrement extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlColumnBuilderWithAutoIncrement';
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
export class MySqlColumnWithAutoIncrement extends MySqlColumn {
    static [entityKind] = 'MySqlColumnWithAutoIncrement';
    autoIncrement = this.config.autoIncrement;
}
//# sourceMappingURL=common.js.map