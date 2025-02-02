import type { SQL, SQLWrapper } from '~/sql/index.ts';
export declare abstract class TypedQueryBuilder<TSelection, TResult = unknown> implements SQLWrapper {
    static readonly [x: number]: string;
    _: {
        selectedFields: TSelection;
        result: TResult;
    };
    abstract getSQL(): SQL;
}
