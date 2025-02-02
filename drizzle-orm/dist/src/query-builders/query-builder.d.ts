import { entityKind } from '~/entity.ts';
import type { SQL, SQLWrapper } from '~/sql/index.ts';
export declare abstract class TypedQueryBuilder<TSelection, TResult = unknown> implements SQLWrapper {
    static readonly [entityKind]: string;
    _: {
        selectedFields: TSelection;
        result: TResult;
    };
    abstract getSQL(): SQL;
}
