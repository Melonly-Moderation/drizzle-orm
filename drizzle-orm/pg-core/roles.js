import { entityKind } from '~/entity.ts';
export class PgRole {
    name;
    static [entityKind] = 'PgRole';
    /** @internal */
    _existing;
    /** @internal */
    createDb;
    /** @internal */
    createRole;
    /** @internal */
    inherit;
    constructor(name, config) {
        this.name = name;
        if (config) {
            this.createDb = config.createDb;
            this.createRole = config.createRole;
            this.inherit = config.inherit;
        }
    }
    existing() {
        this._existing = true;
        return this;
    }
}
export function pgRole(name, config) {
    return new PgRole(name, config);
}
//# sourceMappingURL=roles.js.map