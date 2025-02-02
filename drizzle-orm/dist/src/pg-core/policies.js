import { entityKind } from '~/entity.ts';
export class PgPolicy {
    name;
    static [entityKind] = 'PgPolicy';
    as;
    for;
    to;
    using;
    withCheck;
    /** @internal */
    _linkedTable;
    constructor(name, config) {
        this.name = name;
        if (config) {
            this.as = config.as;
            this.for = config.for;
            this.to = config.to;
            this.using = config.using;
            this.withCheck = config.withCheck;
        }
    }
    link(table) {
        this._linkedTable = table;
        return this;
    }
}
export function pgPolicy(name, config) {
    return new PgPolicy(name, config);
}
//# sourceMappingURL=policies.js.map