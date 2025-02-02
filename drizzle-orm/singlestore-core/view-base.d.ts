import type { ColumnsSelection } from '~/sql/sql.ts';
import { View } from '~/sql/sql.ts';
export declare abstract class SingleStoreViewBase<TName extends string = string, TExisting extends boolean = boolean, TSelectedFields extends ColumnsSelection = ColumnsSelection> extends View<TName, TExisting, TSelectedFields> {
    static readonly [x: number]: string;
    readonly _: View<TName, TExisting, TSelectedFields>['_'] & {
        readonly viewBrand: 'SingleStoreViewBase';
    };
}
