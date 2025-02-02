import { entityKind, is } from '~/entity.ts';
import { singlestoreTableWithSchema } from './table.ts';
/* import { type singlestoreView, singlestoreViewWithSchema } from './view.ts'; */
export class SingleStoreSchema {
    schemaName;
    static [entityKind] = 'SingleStoreSchema';
    constructor(schemaName) {
        this.schemaName = schemaName;
    }
    table = (name, columns, extraConfig) => {
        return singlestoreTableWithSchema(name, columns, extraConfig, this.schemaName);
    };
}
/** @deprecated - use `instanceof SingleStoreSchema` */
export function isSingleStoreSchema(obj) {
    return is(obj, SingleStoreSchema);
}
/**
 * Create a SingleStore schema.
 * https://docs.singlestore.com/cloud/create-a-database/
 *
 * @param name singlestore use schema name
 * @returns SingleStore schema
 */
export function singlestoreDatabase(name) {
    return new SingleStoreSchema(name);
}
/**
 * @see singlestoreDatabase
 */
export const singlestoreSchema = singlestoreDatabase;
//# sourceMappingURL=schema.js.map