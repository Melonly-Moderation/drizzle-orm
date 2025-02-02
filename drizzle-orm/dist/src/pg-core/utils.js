import { is } from '~/entity.ts';
import { PgTable } from '~/pg-core/table.ts';
import { Table } from '~/table.ts';
import { ViewBaseConfig } from '~/view-common.ts';
import { CheckBuilder } from './checks.ts';
import { ForeignKeyBuilder } from './foreign-keys.ts';
import { IndexBuilder } from './indexes.ts';
import { PgPolicy } from './policies.ts';
import { PrimaryKeyBuilder } from './primary-keys.ts';
import { UniqueConstraintBuilder } from './unique-constraint.ts';
import { PgViewConfig } from './view-common.ts';
import { PgMaterializedViewConfig } from './view.ts';
export function getTableConfig(table) {
    const columns = Object.values(table[Table.Symbol.Columns]);
    const indexes = [];
    const checks = [];
    const primaryKeys = [];
    const foreignKeys = Object.values(table[PgTable.Symbol.InlineForeignKeys]);
    const uniqueConstraints = [];
    const name = table[Table.Symbol.Name];
    const schema = table[Table.Symbol.Schema];
    const policies = [];
    const enableRLS = table[PgTable.Symbol.EnableRLS];
    const extraConfigBuilder = table[PgTable.Symbol.ExtraConfigBuilder];
    if (extraConfigBuilder !== undefined) {
        const extraConfig = extraConfigBuilder(table[Table.Symbol.ExtraConfigColumns]);
        const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
        for (const builder of extraValues) {
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
            else if (is(builder, PgPolicy)) {
                policies.push(builder);
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
        policies,
        enableRLS,
    };
}
export function getViewConfig(view) {
    return {
        ...view[ViewBaseConfig],
        ...view[PgViewConfig],
    };
}
export function getMaterializedViewConfig(view) {
    return {
        ...view[ViewBaseConfig],
        ...view[PgMaterializedViewConfig],
    };
}
//# sourceMappingURL=utils.js.map