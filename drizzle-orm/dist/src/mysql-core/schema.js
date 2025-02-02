import { entityKind, is } from '~/entity.ts';
import { mysqlTableWithSchema } from './table.ts';
import { mysqlViewWithSchema } from './view.ts';
export class MySqlSchema {
    schemaName;
    static [entityKind] = 'MySqlSchema';
    constructor(schemaName) {
        this.schemaName = schemaName;
    }
    table = (name, columns, extraConfig) => {
        return mysqlTableWithSchema(name, columns, extraConfig, this.schemaName);
    };
    view = ((name, columns) => {
        return mysqlViewWithSchema(name, columns, this.schemaName);
    });
}
/** @deprecated - use `instanceof MySqlSchema` */
export function isMySqlSchema(obj) {
    return is(obj, MySqlSchema);
}
/**
 * Create a MySQL schema.
 * https://dev.mysql.com/doc/refman/8.0/en/create-database.html
 *
 * @param name mysql use schema name
 * @returns MySQL schema
 */
export function mysqlDatabase(name) {
    return new MySqlSchema(name);
}
/**
 * @see mysqlDatabase
 */
export const mysqlSchema = mysqlDatabase;
//# sourceMappingURL=schema.js.map