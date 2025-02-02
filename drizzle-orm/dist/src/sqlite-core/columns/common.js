import { ColumnBuilder } from '~/column-builder.ts';
import { Column } from '~/column.ts';
import { entityKind } from '~/entity.ts';
import { ForeignKeyBuilder } from '~/sqlite-core/foreign-keys.ts';
import { uniqueKeyName } from '../unique-constraint.ts';
export class SQLiteColumnBuilder extends ColumnBuilder {
    static [entityKind] = 'SQLiteColumnBuilder';
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
// To understand how to use `SQLiteColumn` and `AnySQLiteColumn`, see `Column` and `AnyColumn` documentation.
export class SQLiteColumn extends Column {
    table;
    static [entityKind] = 'SQLiteColumn';
    constructor(table, config) {
        if (!config.uniqueName) {
            config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
    }
}
//# sourceMappingURL=common.js.map