import { entityKind } from './entity.ts';
export class Subquery {
    static [entityKind] = 'Subquery';
    constructor(sql, selection, alias, isWith = false) {
        this._ = {
            brand: 'Subquery',
            sql,
            selectedFields: selection,
            alias: alias,
            isWith,
        };
    }
}
export class WithSubquery extends Subquery {
    static [entityKind] = 'WithSubquery';
}
//# sourceMappingURL=subquery.js.map