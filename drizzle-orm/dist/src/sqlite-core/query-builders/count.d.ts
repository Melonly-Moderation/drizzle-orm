import { entityKind } from '~/entity.ts';
import { SQL, type SQLWrapper } from '~/sql/sql.ts';
import type { SQLiteSession } from '../session.ts';
import type { SQLiteTable } from '../table.ts';
import type { SQLiteView } from '../view.ts';
export declare class SQLiteCountBuilder<TSession extends SQLiteSession<any, any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
    readonly params: {
        source: SQLiteTable | SQLiteView | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    };
    private sql;
    static readonly [entityKind] = "SQLiteCountBuilderAsync";
    [Symbol.toStringTag]: string;
    private session;
    private static buildEmbeddedCount;
    private static buildCount;
    constructor(params: {
        source: SQLiteTable | SQLiteView | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    });
    then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    catch(onRejected?: ((reason: any) => never | PromiseLike<never>) | null | undefined): Promise<number>;
    finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
