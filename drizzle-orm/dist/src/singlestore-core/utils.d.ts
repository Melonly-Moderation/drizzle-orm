import type { Index } from './indexes.ts';
import type { PrimaryKey } from './primary-keys.ts';
import { SingleStoreTable } from './table.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
export declare function getTableConfig(table: SingleStoreTable): {
    columns: import("./index.ts").SingleStoreColumn<import("../column.ts").ColumnBaseConfig<import("../column-builder.ts").ColumnDataType, string>, {}, {}>[];
    indexes: Index[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: string;
    schema: string | undefined;
    baseName: string;
};
