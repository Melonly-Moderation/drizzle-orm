import { entityKind } from '~/entity.ts';
import type { ColumnsSelection } from '~/sql/sql.ts';
import { View } from '~/sql/sql.ts';
export declare abstract class SQLiteViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelection> {
    static readonly [entityKind]: string;
    _: View<TName, TExisting, TSelection>['_'] & {
        viewBrand: 'SQLiteView';
    };
}
