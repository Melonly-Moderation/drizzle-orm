import { is } from '~/entity.ts';
import { Table } from '~/table.ts';
import { ViewBaseConfig } from '~/view-common.ts';
import { CheckBuilder } from './checks.ts';
import { ForeignKeyBuilder } from './foreign-keys.ts';
import { IndexBuilder } from './indexes.ts';
import { PrimaryKeyBuilder } from './primary-keys.ts';
import { SQLiteTable } from './table.ts';
import { UniqueConstraintBuilder } from './unique-constraint.ts';
export function getTableConfig(table) {
    const columns = Object.values(table[SQLiteTable.Symbol.Columns]);
    const indexes = [];
    const checks = [];
    const primaryKeys = [];
    const uniqueConstraints = [];
    const foreignKeys = Object.values(table[SQLiteTable.Symbol.InlineForeignKeys]);
    const name = table[Table.Symbol.Name];
    const extraConfigBuilder = table[SQLiteTable.Symbol.ExtraConfigBuilder];
    if (extraConfigBuilder !== undefined) {
        const extraConfig = extraConfigBuilder(table[SQLiteTable.Symbol.Columns]);
        const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
        for (const builder of Object.values(extraValues)) {
            if (is(builder, IndexBuilder)) {
                indexes.push(builder.build(table));
            }
            else if (is(builder, CheckBuilder)) {
                checks.push(builder.build(table));
            }
            else if (is(builder, UniqueConstraintBuilder)) {
                uniqueConstraints.push(builder.build(table));
            }
            else if (is(builder, PrimaryKeyBuilder)) {
                primaryKeys.push(builder.build(table));
            }
            else if (is(builder, ForeignKeyBuilder)) {
                foreignKeys.push(builder.build(table));
            }
        }
    }
    return {
        columns,
        indexes,
        foreignKeys,
        checks,
        primaryKeys,
        uniqueConstraints,
        name,
    };
}
export function getViewConfig(view) {
    return {
        ...view[ViewBaseConfig],
        // ...view[SQLiteViewConfig],
    };
}
//# sourceMappingURL=utils.js.map