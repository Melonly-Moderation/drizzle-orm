import { entityKind } from '~/entity.ts';
import { TableName } from '~/table.utils.ts';
export class ForeignKeyBuilder {
    static [entityKind] = 'MySqlForeignKeyBuilder';
    /** @internal */
    reference;
    /** @internal */
    _onUpdate;
    /** @internal */
    _onDelete;
    constructor(config, actions) {
        this.reference = () => {
            const { name, columns, foreignColumns } = config();
            return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action;
        return this;
    }
    /** @internal */
    build(table) {
        return new ForeignKey(table, this);
    }
}
export class ForeignKey {
    table;
    static [entityKind] = 'MySqlForeignKey';
    reference;
    onUpdate;
    onDelete;
    constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
            this.table[TableName],
            ...columnNames,
            foreignColumns[0].table[TableName],
            ...foreignColumnNames,
        ];
        return name ?? `${chunks.join('_')}_fk`;
    }
}
export function foreignKey(config) {
    function mappedConfig() {
        const { name, columns, foreignColumns } = config;
        return {
            name,
            columns,
            foreignColumns,
        };
    }
    return new ForeignKeyBuilder(mappedConfig);
}
//# sourceMappingURL=foreign-keys.js.map