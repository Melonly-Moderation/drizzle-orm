import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { PgColumn } from './common.ts';
import { PgDateColumnBaseBuilder } from './date.common.ts';
export class PgDateBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = 'PgDateBuilder';
    constructor(name) {
        super(name, 'date', 'PgDate');
    }
    /** @internal */
    build(table) {
        return new PgDate(table, this.config);
    }
}
export class PgDate extends PgColumn {
    static [entityKind] = 'PgDate';
    getSQLType() {
        return 'date';
    }
    mapFromDriverValue(value) {
        return new Date(value);
    }
    mapToDriverValue(value) {
        return value.toISOString();
    }
}
export class PgDateStringBuilder extends PgDateColumnBaseBuilder {
    static [entityKind] = 'PgDateStringBuilder';
    constructor(name) {
        super(name, 'string', 'PgDateString');
    }
    /** @internal */
    build(table) {
        return new PgDateString(table, this.config);
    }
}
export class PgDateString extends PgColumn {
    static [entityKind] = 'PgDateString';
    getSQLType() {
        return 'date';
    }
}
export function date(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'date') {
        return new PgDateBuilder(name);
    }
    return new PgDateStringBuilder(name);
}
//# sourceMappingURL=date.js.map