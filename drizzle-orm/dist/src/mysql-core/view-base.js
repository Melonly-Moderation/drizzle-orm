import { entityKind } from '~/entity.ts';
import { View } from '~/sql/sql.ts';
export class MySqlViewBase extends View {
    static [entityKind] = 'MySqlViewBase';
}
//# sourceMappingURL=view-base.js.map