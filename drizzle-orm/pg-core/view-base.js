import { entityKind } from '~/entity.ts';
import { View } from '~/sql/sql.ts';
export class PgViewBase extends View {
    static [entityKind] = 'PgViewBase';
}
//# sourceMappingURL=view-base.js.map