import { is } from '~/entity.ts';
import { Table } from '~/table.ts';
import { IndexBuilder } from './indexes.ts';
import { PrimaryKeyBuilder } from './primary-keys.ts';
import { SingleStoreTable } from './table.ts';
import { UniqueConstraintBuilder } from './unique-constraint.ts';
/* import { SingleStoreViewConfig } from './view-common.ts';
import type { SingleStoreView } from './view.ts'; */
export function getTableConfig(table) {
    const columns = Object.values(table[SingleStoreTable.Symbol.Columns]);
    const indexes = [];
    const primaryKeys = [];
    const uniqueConstraints = [];
    const name = table[Table.Symbol.Name];
    const schema = table[Table.Symbol.Schema];
    const baseName = table[Table.Symbol.BaseName];
    const extraConfigBuilder = table[SingleStoreTable.Symbol.ExtraConfigBuilder];
    if (extraConfigBuilder !== undefined) {
        const extraConfig = extraConfigBuilder(table[SingleStoreTable.Symbol.Columns]);
        const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
        for (const builder of Object.values(extraValues)) {
            if (is(builder, IndexBuilder)) {
                indexes.push(builder.build(table));
            }
            else if (is(builder, UniqueConstraintBuilder)) {
                uniqueConstraints.push(builder.build(table));
            }
            else if (is(builder, PrimaryKeyBuilder)) {
                primaryKeys.push(builder.build(table));
            }
        }
    }
    return {
        columns,
        indexes,
        primaryKeys,
        uniqueConstraints,
        name,
        schema,
        baseName,
    };
}
/* export function getViewConfig<
    TName extends string = string,
    TExisting extends boolean = boolean,
>(view: SingleStoreView<TName, TExisting>) {
    return {
        ...view[ViewBaseConfig],
        ...view[SingleStoreViewConfig],
    };
} */
//# sourceMappingURL=utils.js.map