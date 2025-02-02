import { entityKind, is } from '~/entity.ts';
import { SQL, sql } from '~/sql/sql.ts';
import { pgEnumWithSchema } from './columns/enum.ts';
import { pgSequenceWithSchema } from './sequence.ts';
import { pgTableWithSchema } from './table.ts';
import { pgMaterializedViewWithSchema, pgViewWithSchema } from './view.ts';
export class PgSchema {
    schemaName;
    static [entityKind] = 'PgSchema';
    constructor(schemaName) {
        this.schemaName = schemaName;
    }
    table = ((name, columns, extraConfig) => {
        return pgTableWithSchema(name, columns, extraConfig, this.schemaName);
    });
    view = ((name, columns) => {
        return pgViewWithSchema(name, columns, this.schemaName);
    });
    materializedView = ((name, columns) => {
        return pgMaterializedViewWithSchema(name, columns, this.schemaName);
    });
    enum = ((name, values) => {
        return pgEnumWithSchema(name, values, this.schemaName);
    });
    sequence = ((name, options) => {
        return pgSequenceWithSchema(name, options, this.schemaName);
    });
    getSQL() {
        return new SQL([sql.identifier(this.schemaName)]);
    }
    shouldOmitSQLParens() {
        return true;
    }
}
export function isPgSchema(obj) {
    return is(obj, PgSchema);
}
export function pgSchema(name) {
    if (name === 'public') {
        throw new Error(`You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use pgTable() instead of creating a schema`);
    }
    return new PgSchema(name);
}
//# sourceMappingURL=schema.js.map