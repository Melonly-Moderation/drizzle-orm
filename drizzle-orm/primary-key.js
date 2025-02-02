import { entityKind } from '~/entity.ts';
export class PrimaryKey {
    table;
    columns;
    static [entityKind] = 'PrimaryKey';
    constructor(table, columns) {
        this.table = table;
        this.columns = columns;
    }
}
//# sourceMappingURL=primary-key.js.map