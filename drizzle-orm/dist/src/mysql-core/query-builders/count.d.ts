import { entityKind } from '~/entity.ts';
import { SQL, type SQLWrapper } from '~/sql/sql.ts';
import type { MySqlSession } from '../session.ts';
import type { MySqlTable } from '../table.ts';
import type { MySqlViewBase } from '../view-base.ts';
export declare class MySqlCountBuilder<TSession extends MySqlSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
    readonly params: {
        source: MySqlTable | MySqlViewBase | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    };
    private sql;
    static readonly [entityKind] = "MySqlCountBuilder";
    [Symbol.toStringTag]: string;
    private session;
    private static buildEmbeddedCount;
    private static buildCount;
    constructor(params: {
        source: MySqlTable | MySqlViewBase | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    });
    then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    catch(onRejected?: ((reason: any) => never | PromiseLike<never>) | null | undefined): Promise<number>;
    finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
