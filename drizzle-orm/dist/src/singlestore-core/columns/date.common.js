import { entityKind } from '~/entity.ts';
import { sql } from '~/sql/sql.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreDateColumnBaseBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreDateColumnBuilder';
    defaultNow() {
        return this.default(sql `now()`);
    }
    onUpdateNow() {
        this.config.hasOnUpdateNow = true;
        this.config.hasDefault = true;
        return this;
    }
}
export class SingleStoreDateBaseColumn extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreDateColumn';
    hasOnUpdateNow = this.config.hasOnUpdateNow;
}
//# sourceMappingURL=date.common.js.map