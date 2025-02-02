import { entityKind } from '~/entity.ts';
import { sql } from '~/sql/sql.ts';
import { PgColumnBuilder } from './common.ts';
export class PgDateColumnBaseBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgDateColumnBaseBuilder';
    defaultNow() {
        return this.default(sql `now()`);
    }
}
//# sourceMappingURL=date.common.js.map