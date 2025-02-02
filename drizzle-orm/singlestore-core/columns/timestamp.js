import { entityKind } from '~/entity.ts';
import { sql } from '~/sql/sql.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreDateBaseColumn, SingleStoreDateColumnBaseBuilder } from './date.common.ts';
export class SingleStoreTimestampBuilder extends SingleStoreDateColumnBaseBuilder {
    static [entityKind] = 'SingleStoreTimestampBuilder';
    constructor(name) {
        super(name, 'date', 'SingleStoreTimestamp');
    }
    /** @internal */
    build(table) {
        return new SingleStoreTimestamp(table, this.config);
    }
    defaultNow() {
        return this.default(sql `CURRENT_TIMESTAMP`);
    }
}
export class SingleStoreTimestamp extends SingleStoreDateBaseColumn {
    static [entityKind] = 'SingleStoreTimestamp';
    getSQLType() {
        return `timestamp`;
    }
    mapFromDriverValue(value) {
        return new Date(value + '+0000');
    }
    mapToDriverValue(value) {
        return value.toISOString().slice(0, -1).replace('T', ' ');
    }
}
export class SingleStoreTimestampStringBuilder extends SingleStoreDateColumnBaseBuilder {
    static [entityKind] = 'SingleStoreTimestampStringBuilder';
    constructor(name) {
        super(name, 'string', 'SingleStoreTimestampString');
    }
    /** @internal */
    build(table) {
        return new SingleStoreTimestampString(table, this.config);
    }
    defaultNow() {
        return this.default(sql `CURRENT_TIMESTAMP`);
    }
}
export class SingleStoreTimestampString extends SingleStoreDateBaseColumn {
    static [entityKind] = 'SingleStoreTimestampString';
    getSQLType() {
        return `timestamp`;
    }
}
export function timestamp(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    if (config?.mode === 'string') {
        return new SingleStoreTimestampStringBuilder(name);
    }
    return new SingleStoreTimestampBuilder(name);
}
//# sourceMappingURL=timestamp.js.map