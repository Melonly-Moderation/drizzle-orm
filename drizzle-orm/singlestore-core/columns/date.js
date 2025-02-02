import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreDateBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreDateBuilder';
    constructor(name) {
        super(name, 'date', 'SingleStoreDate');
    }
    /** @internal */
    build(table) {
        return new SingleStoreDate(table, this.config);
    }
}
export class SingleStoreDate extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreDate';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
    mapFromDriverValue(value) {
        return new Date(value);
    }
}
export class SingleStoreDateStringBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreDateStringBuilder';
    constructor(name) {
        super(name, 'string', 'SingleStoreDateString');
    }
    /** @internal */
    build(table) {
        return new SingleStoreDateString(table, this.config);
    }
}
export class SingleStoreDateString extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreDateString';
    constructor(table, config) {
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
}
export function date(a, b) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new SingleStoreDateStringBuilder(name);
    }
    return new SingleStoreDateBuilder(name);
}
//# sourceMappingURL=date.js.map