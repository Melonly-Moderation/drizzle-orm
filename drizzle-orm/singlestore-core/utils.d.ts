import type { Index } from './indexes.ts';
import type { PrimaryKey } from './primary-keys.ts';
import { SingleStoreTable } from './table.ts';
import { type UniqueConstraint } from './unique-constraint.ts';
export declare function getTableConfig(table: SingleStoreTable): {
    columns: unknown[];
    indexes: Index[];
    primaryKeys: PrimaryKey[];
    uniqueConstraints: UniqueConstraint[];
    name: any;
    schema: any;
    baseName: any;
};
