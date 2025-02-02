import { entityKind } from '~/entity.ts';
export class CheckBuilder {
    name;
    value;
    static [entityKind] = 'PgCheckBuilder';
    brand;
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    /** @internal */
    build(table) {
        return new Check(table, this);
    }
}
export class Check {
    table;
    static [entityKind] = 'PgCheck';
    name;
    value;
    constructor(table, builder) {
        this.table = table;
        this.name = builder.name;
        this.value = builder.value;
    }
}
export function check(name, value) {
    return new CheckBuilder(name, value);
}
//# sourceMappingURL=checks.js.map