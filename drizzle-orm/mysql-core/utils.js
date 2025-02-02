import { is } from '~/entity.ts';
import { Table } from '~/table.ts';
import { ViewBaseConfig } from '~/view-common.ts';
import { CheckBuilder } from './checks.ts';
import { ForeignKeyBuilder } from './foreign-keys.ts';
import { IndexBuilder } from './indexes.ts';
import { PrimaryKeyBuilder } from './primary-keys.ts';
import { MySqlTable } from './table.ts';
import { UniqueConstraintBuilder } from './unique-constraint.ts';
import { MySqlViewConfig } from './view-common.ts';
export function getTableConfig(table) {
    const columns = Object.values(table[MySqlTable.Symbol.Columns]);
    const indexes = [];
    const checks = [];
    const primaryKeys = [];
    const uniqueConstraints = [];
    const foreignKeys = Object.values(table[MySqlTable.Symbol.InlineForeignKeys]);
    const name = table[Table.Symbol.Name];
    const schema = table[Table.Symbol.Schema];
    const baseName = table[Table.Symbol.BaseName];
    const extraConfigBuilder = table[MySqlTable.Symbol.ExtraConfigBuilder];
    if (extraConfigBuilder !== undefined) {
        const extraConfig = extraConfigBuilder(table[MySqlTable.Symbol.Columns]);
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
        schema,
        baseName,
    };
}
export function getViewConfig(view) {
    return {
        ...view[ViewBaseConfig],
        ...view[MySqlViewConfig],
    };
}
export function convertIndexToString(indexes) {
    return indexes.map((idx) => {
        return typeof idx === 'object' ? idx.config.name : idx;
    });
}
export function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
//# sourceMappingURL=utils.js.map